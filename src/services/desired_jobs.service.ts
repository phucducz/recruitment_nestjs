import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getItemsDiff } from 'src/common/utils/function';
import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { AchivementsRepository } from 'src/modules/achivements/achivements.repository';
import { DesiredJobsRepository } from 'src/modules/desired_jobs/desired_jobs.repository';
import { DesiredJobsPlacementRepository } from 'src/modules/desired_jobs_placements/desired_jobs_placement.repository';
import { DesiredJobsPositionRepository } from 'src/modules/desired_jobs_positions/desired_jobs_position.repository';
import { JobFieldsRepository } from 'src/modules/job_fields/job_fields.repository';
import { JobPositionsRepository } from 'src/modules/job_positions/job_positions.repository';
import { PlacementsRepository } from 'src/modules/placements/placements.repository';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UsersSkillsRepository } from 'src/modules/users_skills/users_skills.repository';

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
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
    @Inject(AchivementsRepository)
    private readonly achivementRepository: AchivementsRepository,
    @Inject(UsersSkillsRepository)
    private readonly userSkillRepository: UsersSkillsRepository,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async create(createDesiredJobDto: ICreate<CreateDesiredJobDto>) {
    const { createBy, variable } = createDesiredJobDto;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await this.userRepository.findById(createBy);
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
            variables: skillsToAdd.map((skill) => ({
              level: skill.level,
              skillsId: skill.id,
            })),
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
            variable: { description: variable.achivements },
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

        await Promise.all(
          placements.map((placement) =>
            this.desiredJobsPlacementRepository.create({
              createBy,
              variable: { desiredJob, placement },
              transactionalEntityManager,
            }),
          ),
        );

        const jobPositions = await this.jobPositionRepository.findByIds(
          variable.jobPositionIds,
        );

        await Promise.all(
          jobPositions.map((jobPosition) =>
            this.desiredJobPositionRepository.create({
              createBy,
              variable: { desiredJob, jobPosition },
              transactionalEntityManager,
            }),
          ),
        );

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

  findOne(id: number) {
    return `This action returns a #${id} desiredJob`;
  }

  async update(id: number, updateDesiredJobDto: IUpdate<UpdateDesiredJobDto>) {
    const { variable } = updateDesiredJobDto;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const storedDesiredJobPositions =
          await this.desiredJobPositionRepository.findBy({
            where: { desiredJobsId: id },
          });
        const desiredJobPositionsToAdd = variable.jobPositionIds.filter(
          (positionId) =>
            !storedDesiredJobPositions.some(
              (jobPosition) => jobPosition.jobPositionsId === positionId,
            ),
        );
        const desiredJobPositionsToRemove = storedDesiredJobPositions.filter(
          (jobPosition) =>
            !variable.jobPositionIds.some(
              (positionId) => positionId === jobPosition.jobPositionsId,
            ),
        );

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
