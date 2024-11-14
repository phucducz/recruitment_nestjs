import { Inject, Injectable } from '@nestjs/common';

import { JOB_STATUS } from 'src/common/utils/enums';
import { getItemsDiff } from 'src/common/utils/function';
import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
import { JobsRepository } from 'src/modules/jobs/jobs.repository';
import { DataSource } from 'typeorm';
import { JobCategoriesService } from './job_categories.service';
import { JobFieldsService } from './job_fields.service';
import { JobPositionsService } from './job_positions.service';
import { JobsPlacementsService } from './jobs_placements.service';
import { PlacementsService } from './placements.service';
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
    @Inject(PlacementsService)
    private readonly placementService: PlacementsService,
    @Inject(JobsPlacementsService)
    private readonly jobsPlacementsService: JobsPlacementsService,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async create(createJob: ICreate<CreateJobDto>) {
    const { variable, createBy } = createJob;

    return this.jobRepository.create({
      ...createJob,
      variable: {
        ...variable,
        jobCategory: await this.jobCategoryService.findById(
          variable.categoriesId,
        ),
        jobPosition: await this.jobPositionService.findById(
          variable.positionsId,
        ),
        jobField: await this.jobFieldService.findById(variable.fieldsId),
        user: await this.userService.findById(createBy),
        workType: await this.workTypeService.findById(variable.workTypesId),
        placements: await Promise.all(
          variable.placementIds.map(async (placement) => {
            return await this.placementService.findById(placement);
          }),
        ),
      },
    });
  }

  async findAll(jobsQueries: IJobQueries) {
    return await this.jobRepository.findAll(jobsQueries);
  }

  async findAllForEmployer(
    jobsQueries: IFIndJobsForEmployerQueries & { usersId: number },
  ) {
    return await this.jobRepository.findAllForEmployer(jobsQueries);
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

    if (
      variable.status &&
      !Object.values(JOB_STATUS).includes(variable.status as JOB_STATUS)
    ) {
      throw new Error(
        `Trạng thái không hợp lệ. Trạng thái phải là một trong "${Object.values(JOB_STATUS).join(', ')}"`,
      );
    }

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
            ...variable,
            jobCategory: await this.jobCategoryService.findById(
              variable.categoriesId,
            ),
            jobPosition: await this.jobPositionService.findById(
              variable.positionsId,
            ),
            jobField: await this.jobFieldService.findById(variable.fieldsId),
            workType: await this.workTypeService.findById(variable.workTypesId),
          },
          transactionalEntityManager,
        });
      },
    );
  }

  async remove(deleteJobDto: ISoftDelete<{ id: number }>) {
    return await this.jobRepository.delete(deleteJobDto);
  }
}
