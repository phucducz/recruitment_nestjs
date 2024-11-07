import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getItemsDiff } from 'src/common/utils/function';
import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { DesiredJobsPlacement } from 'src/entities/desired_jobs_placement.entity';
import { DesiredJobsPosition } from 'src/entities/desired_jobs_position.entity';
import { AchivementsRepository } from 'src/modules/achivements/achivements.repository';
import { DesiredJobsRepository } from 'src/modules/desired_jobs/desired_jobs.repository';
import { DesiredJobsPlacementRepository } from 'src/modules/desired_jobs_placements/desired_jobs_placement.repository';
import { DesiredJobsPositionRepository } from 'src/modules/desired_jobs_positions/desired_jobs_position.repository';
import { JobFieldsRepository } from 'src/modules/job_fields/job_fields.repository';
import { JobPositionsRepository } from 'src/modules/job_positions/job_positions.repository';
import { PlacementsRepository } from 'src/modules/placements/placements.repository';
import { UsersSkillsRepository } from 'src/modules/users_skills/users_skills.repository';
import { SkillsService } from './skills.service';
import { UsersService } from './users.service';

@Injectable()
export class DesiredJobsService {
  constructor(
    @Inject(DesiredJobsRepository)
    private readonly desiredJobRepository: DesiredJobsRepository,
    @Inject(DesiredJobsPlacementRepository)
    private readonly desiredJobsPlacementRepository: DesiredJobsPlacementRepository,
    @Inject(DesiredJobsPositionRepository)
    private readonly desiredJobPositionRepository: DesiredJobsPositionRepository,
    @Inject(PlacementsRepository)
    private readonly placementRepository: PlacementsRepository,
    @Inject(JobPositionsRepository)
    private readonly jobPositionRepository: JobPositionsRepository,
    @Inject(JobFieldsRepository)
    private readonly jobFieldRepository: JobFieldsRepository,
    @Inject(AchivementsRepository)
    private readonly achivementRepository: AchivementsRepository,
    @Inject(UsersSkillsRepository)
    private readonly userSkillRepository: UsersSkillsRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(SkillsService) private readonly skillService: SkillsService,
  ) {}

  async create(createDesiredJobDto: ICreate<CreateDesiredJobDto>) {
    const { createBy, variable } = createDesiredJobDto;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await this.userService.findById(createBy);
        const storedSkills = await this.userSkillRepository.findByUserId(
          user.id,
        );

        const {
          itemToUpdate: skillToUpdate,
          itemsToAdd: skillsToAdd,
          itemsToRemove: skillsToRemove,
        } = getItemsDiff({
          items: { data: variable.skills, key: 'id' },
          storedItems: { data: storedSkills, key: 'skillsId' },
        });

        if (skillsToRemove.length > 0)
          await this.userSkillRepository.removeMany(
            skillsToRemove.map((skill) => ({
              skillsId: skill.skillsId,
              usersId: user.id,
            })),
          );

        if (skillsToAdd.length > 0)
          await this.userSkillRepository.createMany({
            createBy,
            variables: await Promise.all(
              skillsToAdd.map(async (skill) => ({
                level: skill.level,
                skillsId: skill.id,
                skill: await this.skillService.findById(skill.id),
                user,
              })),
            ),
          });
        if (skillToUpdate.length > 0)
          await this.userSkillRepository.updateMany({
            updateBy: createBy,
            variables: skillToUpdate.map((skill) => ({
              level: skill.level,
              skillsId: skill.id,
            })),
          });

        if (user.achivement) {
          const achivements = await this.achivementRepository.findById(
            user.achivement.id,
          );

          await this.achivementRepository.update(achivements.id, {
            updateBy: createBy,
            variable: { description: variable.achivements },
          });
        } else
          await this.achivementRepository.create({
            createBy,
            variable: {
              description: variable.achivements,
              user,
            },
          });

        const desiredJob = await this.desiredJobRepository.create({
          ...createDesiredJobDto,
          variable: {
            ...createDesiredJobDto.variable,
            jobField: await this.jobFieldRepository.findById(
              variable.jobFieldsId,
            ),
            user,
          },
          transactionalEntityManager,
        });

        const placements = await this.placementRepository.findByIds(
          variable.jobPlacementIds,
        );

        await this.desiredJobsPlacementRepository.createMany({
          createBy,
          variables: placements.map((placement) => ({
            desiredJob,
            placement,
          })),
          transactionalEntityManager,
        });

        const jobPositions = await this.jobPositionRepository.findByIds(
          variable.jobPositionIds,
        );

        await this.desiredJobPositionRepository.createMany({
          createBy,
          variables: jobPositions.map((jobPosition) => ({
            desiredJob,
            jobPosition,
          })),
          transactionalEntityManager,
        });

        return desiredJob;
      },
    );
  }

  async findAll(desiredJobsQueries: IFindDesiredJobsQueries) {
    const [items, totalItems] =
      await this.desiredJobRepository.findAll(desiredJobsQueries);

    return [
      await Promise.all(
        items.map(async (item) => ({
          ...item,
          desiredJobsPlacement:
            await this.desiredJobsPlacementRepository.findBy({
              where: { desiredJob: { id: item.id } },
              relations: ['placement'],
              select: {
                ...filterColumns(
                  ENTITIES.FIELDS.DESIRED_JOBS_PLACEMENT,
                  removeColumns,
                ),
                placement: { id: true, title: true },
              },
            }),
        })),
      ),
      totalItems,
    ] as [DesiredJob[], number];
  }

  async findById(id: number) {
    return await this.desiredJobRepository.findById(id);
  }

  async update(id: number, updateDesiredJobDto: IUpdate<UpdateDesiredJobDto>) {
    const { updateBy, variable } = updateDesiredJobDto;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const desiredJob = await this.desiredJobRepository.findById(id);

        const {
          itemsToAdd: desiredJobPositionToAdd,
          itemsToRemove: desiredJobPositionToRemove,
        } = getItemsDiff({
          items: {
            data: variable.jobPositionIds,
          },
          storedItems: {
            data: await this.desiredJobPositionRepository.findBy({
              where: { desiredJobsId: id },
            }),
            key: 'jobPositionsId',
          },
        });

        if (desiredJobPositionToAdd.length > 0) {
          const jobPositions = await this.jobPositionRepository.findByIds(
            desiredJobPositionToAdd as number[],
          );

          await this.desiredJobPositionRepository.createMany({
            createBy: updateBy,
            variables: await Promise.all(
              jobPositions.map((jobPosition) => ({
                desiredJob,
                jobPosition,
              })),
            ),
          });
        }
        if (desiredJobPositionToRemove.length > 0) {
          await this.desiredJobPositionRepository.removeMany({
            variable: desiredJobPositionToRemove as DesiredJobsPosition[],
            transactionalEntityManager,
          });
        }

        const {
          itemsToAdd: desiredJobsPlacementToAdd,
          itemsToRemove: desiredJobsPlacementToRemove,
        } = getItemsDiff({
          items: { data: variable.jobPlacementIds },
          storedItems: {
            data: await this.desiredJobsPlacementRepository.findBy({
              where: { desiredJobsId: id },
            }),
            key: 'placementsId',
          },
        });

        if (desiredJobsPlacementToAdd.length > 0) {
          const placements = await this.placementRepository.findByIds(
            desiredJobsPlacementToAdd as number[],
          );

          await this.desiredJobsPlacementRepository.createMany({
            createBy: updateBy,
            variables: await Promise.all(
              placements.map((placement) => ({ placement, desiredJob })),
            ),
          });
        }
        if (desiredJobsPlacementToRemove.length > 0) {
          await this.desiredJobsPlacementRepository.removeMany({
            variable: desiredJobsPlacementToRemove as DesiredJobsPlacement[],
            transactionalEntityManager,
          });
        }

        return await this.desiredJobRepository.update(id, {
          ...updateDesiredJobDto,
          variable: {
            ...variable,
            jobField: await this.jobFieldRepository.findById(
              variable.jobFieldsId,
            ),
          },
          transactionalEntityManager,
        });
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} desiredJob`;
  }
}
