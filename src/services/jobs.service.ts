import { Inject, Injectable } from '@nestjs/common';

import { STATUS_TITLES, STATUS_TYPE_TITLES } from 'src/common/utils/enums';
import { getItemsDiff } from 'src/common/utils/function';
import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
import { JobsRepository } from 'src/modules/jobs/jobs.repository';
import { DataSource } from 'typeorm';
import { JobCategoriesService } from './job_categories.service';
import { JobFieldsService } from './job_fields.service';
import { JobPositionsService } from './job_positions.service';
import { JobsPlacementsService } from './jobs_placements.service';
import { StatusService } from './status.service';
import { StatusTypesService } from './status_types.service';
import { UsersService } from './users.service';
import { WorkTypesService } from './work_types.service';

@Injectable()
export class JobsService {
  constructor(
    @Inject(JobsRepository) private readonly jobRepository: JobsRepository,
    @Inject(JobCategoriesService)
    private readonly jobCategoryService: JobCategoriesService,
    @Inject(JobPositionsService)
    private readonly jobPositionService: JobPositionsService,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(WorkTypesService)
    private readonly workTypeService: WorkTypesService,
    @Inject(JobsPlacementsService)
    private readonly jobsPlacementsService: JobsPlacementsService,
    @Inject(StatusService)
    private readonly statusService: StatusService,
    @Inject(StatusTypesService)
    private readonly statusTypesService: StatusTypesService,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async create(createJob: ICreate<CreateJobDto>) {
    const { variable, createBy } = createJob;
    const statusType = await this.statusTypesService.findByTitle(
      STATUS_TYPE_TITLES.JOB,
    );

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const newJob = await this.jobRepository.create({
          ...createJob,
          variable: {
            ...variable,
            status: await this.statusService.findByTitle(
              STATUS_TITLES.JOB_ACTIVE,
              statusType.id,
            ),
            jobCategory: await this.jobCategoryService.findById(
              variable.categoriesId,
            ),
            jobPosition: await this.jobPositionService.findById(
              variable.positionsId,
            ),
            jobField: await this.jobFieldService.findById(variable.fieldsId),
            user: await this.userService.findById(createBy),
            workType: await this.workTypeService.findById(variable.workTypesId),
          },
          transactionalEntityManager,
        });

        await this.jobsPlacementsService.create({
          createBy,
          variable: {
            job: newJob,
            jobsId: undefined,
            placementIds: variable.placementIds,
          },
          transactionalEntityManager,
        });

        return newJob;
      },
    );
  }

  async findAll(jobsQueries: IJobQueries) {
    return await this.jobRepository.findAll(jobsQueries);
  }

  async findAllForEmployer(
    jobsQueries: IFIndJobsForEmployerQueries & { usersId: number },
  ) {
    const status = await this.statusService.findByType(
      STATUS_TYPE_TITLES.INTERVIEW,
    );
    return await this.jobRepository.findAllForEmployer({
      ...jobsQueries,
      status,
    });
  }

  async findById(id: number) {
    return await this.jobRepository.findById(id);
  }

  async update(
    id: number,
    updateJobDto: IUpdate<
      UpdateJobDto & { deleteAt?: string; deleteBy?: number }
    >,
  ) {
    const { variable, updateBy } = updateJobDto;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        if ((variable?.placementIds ?? []).length > 0) {
          const {
            itemsToRemove: jobPlacementsToRemove,
            itemsToAdd: jobPlacementsToAdd,
          } = getItemsDiff({
            items: { data: variable.placementIds },
            storedItems: {
              data: await this.jobsPlacementsService.findByJobsId(id),
              key: 'placements_id',
            },
          });

          console.log(
            'item',
            {
              itemsToRemove: jobPlacementsToRemove,
              itemsToAdd: jobPlacementsToAdd,
            },
            'jobsId: ',
            id,
          );

          if (jobPlacementsToRemove.length > 0)
            await this.jobsPlacementsService.removeMany({
              variables: jobPlacementsToRemove.map((item) => ({
                jobsId: item.jobsId,
                placementsId: item.placementsId,
              })),
              transactionalEntityManager,
            });

          if (jobPlacementsToAdd.length > 0)
            await this.jobsPlacementsService.create({
              createBy: updateBy,
              variable: { jobsId: id, placementIds: jobPlacementsToAdd },
              transactionalEntityManager,
            });
        }

        return await this.jobRepository.update(id, {
          ...updateJobDto,
          variable: {
            ...(variable.salaryMin && { salaryMin: variable.salaryMin }),
            ...(variable.salaryMax && { salaryMax: variable.salaryMax }),
            ...(variable.quantity && { quantity: variable.quantity }),
            ...(variable.description && { description: variable.description }),
            ...(variable.requirements && {
              requirements: variable.requirements,
            }),
            ...(variable.benefits && { benefits: variable.benefits }),
            ...(variable.fieldsId && {
              jobField: await this.jobFieldService.findById(variable.fieldsId),
            }),
            ...(variable.categoriesId && {
              jobCategory: await this.jobCategoryService.findById(
                variable.categoriesId,
              ),
            }),
            ...(variable.workTypesId && {
              workType: await this.workTypeService.findById(
                variable.workTypesId,
              ),
            }),
            ...(variable.statusId && {
              status: await this.statusService.findById(variable.statusId),
            }),
            ...(variable.positionsId && {
              jobPosition: await this.jobPositionService.findById(
                variable.positionsId,
              ),
            }),
            ...(typeof variable.deleteAt !== 'undefined' && { deleteAt: null }),
            ...(typeof variable.deleteBy !== 'undefined' && { deleteBy: null }),
            ...(variable.statusId && {
              status: await this.statusService.findById(variable.statusId),
            }),
          },
          transactionalEntityManager,
        });
      },
    );
  }

  async remove(deleteJobDto: ISoftDelete<{ id: number }>) {
    const { variable } = deleteJobDto;
    const statusType = await this.statusTypesService.findByTitle(
      STATUS_TYPE_TITLES.JOB,
    );

    return await this.jobRepository.delete({
      ...deleteJobDto,
      variable: {
        ...variable,
        status: await this.statusService.findByTitle(
          STATUS_TITLES.JOB_DELETED,
          statusType.id,
        ),
      },
    });
  }
}
