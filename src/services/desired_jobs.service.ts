import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, FindOneOptions } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import {
  START_AFTER_OFFER_DESIRED_JOB,
  STATUS_CODE,
} from 'src/common/utils/enums';
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
import { UsersForeignLanguagesRepository } from 'src/modules/users_foreign_languages/user_foreign_languages.repository';
import { ForeignLanguagesService } from './foreign_languages.service';
import { StatusService } from './status.service';
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
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(UsersForeignLanguagesRepository)
    private readonly usersForeignLanguagesRepository: UsersForeignLanguagesRepository,
    @Inject(ForeignLanguagesService)
    private readonly foreignLanguagesService: ForeignLanguagesService,
    @Inject(StatusService)
    private readonly statusService: StatusService,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  checkValidStartAfterOfferField(startAfterOffer: string) {
    if (
      startAfterOffer &&
      !Object.values(START_AFTER_OFFER_DESIRED_JOB).includes(
        startAfterOffer as START_AFTER_OFFER_DESIRED_JOB,
      )
    )
      throw new Error(
        `Thời gian bắt đầu làm việc không hợp lệ. Giá trị phải là một trong "${Object.values(START_AFTER_OFFER_DESIRED_JOB).join(', ')}"`,
      );

    return true;
  }

  async create(createDesiredJobDto: ICreate<CreateDesiredJobDto>) {
    const { createBy, variable } = createDesiredJobDto;

    this.checkValidStartAfterOfferField(variable.startAfterOffer);

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await this.userService.findById(createBy);
        const [storedForeignLanguages] =
          await this.usersForeignLanguagesRepository.findBy({
            usersId: user.id,
          });

        const {
          itemToUpdate: foreignLanguagesToUpdate,
          itemsToAdd: foreignLanguagesToAdd,
          itemsToRemove: foreignLanguagesToRemove,
        } = getItemsDiff({
          items: { data: variable.foreignLanguages, key: 'id' },
          storedItems: {
            data: storedForeignLanguages,
            key: 'foreignLanguagesId',
          },
        });

        if (foreignLanguagesToAdd.length > 0)
          await this.usersForeignLanguagesRepository.createMany({
            createBy: user.id,
            variables: await Promise.all(
              foreignLanguagesToAdd.map(async (foreignLanguage) => ({
                foreignLanguage: await this.foreignLanguagesService.findById(
                  foreignLanguage.id,
                ),
                level: foreignLanguage.level,
                user,
                foreignLanguagesId: foreignLanguage.id,
              })),
            ),
          });

        if (foreignLanguagesToUpdate.length > 0)
          await this.usersForeignLanguagesRepository.updateMany(
            foreignLanguagesToUpdate.map((foreignLanguage) => ({
              queries: {
                foreignLanguagesId: foreignLanguage.id,
                usersId: user.id,
              },
              updateBy: createBy,
              variable: { level: foreignLanguage.level },
              transactionalEntityManager,
            })),
          );

        if (foreignLanguagesToRemove.length > 0)
          await this.usersForeignLanguagesRepository.removeMany(
            foreignLanguagesToRemove.map((foreignLanguage) => ({
              foreignLanguagesId: foreignLanguage.foreignLanguagesId,
              usersId: user.id,
            })),
          );

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
            user,
            status: await this.statusService.findByCode(
              STATUS_CODE.APPROVAL_PENDING,
            ),
            jobField: await this.jobFieldRepository.findById(
              variable.jobFieldsId,
            ),
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

  async findOneBy(options: FindOneOptions<DesiredJob>) {
    return await this.desiredJobRepository.findOneBy(options);
  }

  async approve(id: number, updateDesiredJobDto: IUpdate<UpdateDesiredJobDto>) {
    const { updateBy, variable } = updateDesiredJobDto;

    return await this.desiredJobRepository.approve(+id, {
      updateBy,
      variable: {
        status: await this.statusService.findByCode(
          variable.type === 'approve'
            ? STATUS_CODE.APPROVAL_APPROVED
            : STATUS_CODE.APPROVAL_REJECTED,
        ),
      },
    });
  }

  async update(id: number, updateDesiredJobDto: IUpdate<UpdateDesiredJobDto>) {
    const { updateBy, variable } = updateDesiredJobDto;

    this.checkValidStartAfterOfferField(variable.startAfterOffer);

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const desiredJob = await this.desiredJobRepository.findById(id);

        if ((variable?.jobPositionIds ?? []).length > 0) {
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
        }

        if ((variable?.jobPlacementIds ?? []).length > 0) {
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
        }

        return await this.desiredJobRepository.update(id, {
          ...updateDesiredJobDto,
          variable: {
            ...variable,
            ...(variable.jobFieldsId && {
              jobField: await this.jobFieldRepository.findById(
                variable.jobFieldsId,
              ),
            }),
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
