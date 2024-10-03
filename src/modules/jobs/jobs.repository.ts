import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Raw, Repository } from 'typeorm';

import { JobConverter } from 'src/common/converters/job.converter';
import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { Job } from 'src/entities/job.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { JobCategoriesService } from 'src/services/job_categories.service';
import { JobFieldsService } from 'src/services/job_fields.service';
import { JobPositionsService } from 'src/services/job_positions.service';
import { JobsPlacementsService } from 'src/services/jobs_placements.service';
import { PlacementsService } from 'src/services/placements.service';
import { UsersService } from 'src/services/users.service';
import { WorkTypesService } from 'src/services/work_types.service';

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(JobCategoriesService)
    private readonly jobCategoryService: JobCategoriesService,
    @Inject(JobPositionsService)
    private readonly jobPositionService: JobPositionsService,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(WorkTypesService)
    private readonly workTypeService: WorkTypesService,
    @InjectRepository(JobsPlacement)
    private readonly jobPlacementRepository: Repository<JobsPlacement>,
    @Inject(PlacementsService)
    private readonly placementService: PlacementsService,
    @Inject(JobsPlacementsService)
    private readonly jobsPlacementsService: JobsPlacementsService,
    @Inject(JobConverter) private readonly jobConverter: JobConverter,
  ) {}

  private readonly logger = new Logger(JobsRepository.name);

  private readonly jobRelations = {
    entites: [
      'user',
      'jobPosition',
      'jobField',
      'jobsPlacements',
      'workType',
      'jobCategory',
      'jobsPlacements.placement',
    ],
    fields: [
      filterColumns(ENTITIES.FIELDS.USER, ['password', ...removeColumns]),
      filterColumns(ENTITIES.FIELDS.JOB_POSITION, removeColumns),
      filterColumns(ENTITIES.FIELDS.JOB_FIELD, removeColumns),
      filterColumns(ENTITIES.FIELDS.JOB_PLACEMENT, removeColumns),
      filterColumns(ENTITIES.FIELDS.WORK_TYPE, removeColumns),
      filterColumns(ENTITIES.FIELDS.JOB_CATEGORY, removeColumns),
    ],
  };

  private readonly placementSelectColumns = filterColumns(
    ENTITIES.FIELDS.PLACEMENT,
    removeColumns,
  );

  private readonly jobSelectColumns = this.jobRelations.entites.reduce(
    (acc, entity, index) => {
      acc[entity] = this.jobRelations.fields[index];
      return acc;
    },
    {},
  ) as any;

  generateJobRelationships(): Pick<
    FindManyOptions<Job>,
    'select' | 'relations'
  > {
    return {
      relations: this.jobRelations.entites,
      select: {
        ...this.jobSelectColumns,
        jobsPlacements: {
          ...this.jobSelectColumns.jobsPlacements,
          placement: this.placementSelectColumns,
        },
      },
    };
  }

  async findAll(jobsQueries: IJobQueries) {
    const {
      categoriesId,
      jobFieldsId,
      page,
      pageSize,
      placementsId,
      salaryMax,
      salaryMin,
      title,
      workTypesId,
    } = jobsQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    return await this.jobRepository.findAndCount({
      ...paginationParams,
      where: {
        ...(title && { title: Raw((value) => `${value} ILIKE '%${title}%'`) }),
        ...(salaryMin && {
          salaryMin: Raw((value) => `${value} >= ${+salaryMin}`),
        }),
        ...(salaryMax && {
          salaryMax: Raw((value) => `${value} <= ${+salaryMax}`),
        }),
        ...(categoriesId && { jobCategory: { id: +categoriesId } }),
        ...(jobFieldsId && { jobField: { id: +jobFieldsId } }),
        ...(placementsId && {
          jobsPlacements: { placementsId: +placementsId },
        }),
        ...(workTypesId && { workType: { id: +workTypesId } }),
      },
      ...this.generateJobRelationships(),
      order: { createAt: 'DESC' },
    });
  }

  async findById(id: number) {
    return await this.jobRepository.find({
      where: { id: id },
      ...this.generateJobRelationships(),
    });
  }

  async create(createJob: ICreate<CreateJobDto>) {
    try {
      const { createBy, variable } = createJob;
      let newJobRecord: Job | null = null;

      await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          newJobRecord = await transactionalEntityManager.save(
            Job,
            this.jobRepository.create({
              applicationDeadline: variable.deadline,
              createAt: new Date().toString(),
              createBy,
              description: variable.description,
              minExpYearRequired: variable.minExpYearRequired,
              salaryMax: variable.salaryMax,
              requirements: variable.requirements,
              maxExpYearRequired: variable.maxExpYearRequired,
              salaryMin: variable.salaryMin,
              title: variable.title,
              benefits: variable.benefits,
              salaryCurrency: variable.salaryCurrency,
              quantity: variable.quantity,
              jobCategory: await this.jobCategoryService.findById(
                variable.categoriesId,
              ),
              jobPosition: await this.jobPositionService.findById(
                variable.positionsId,
              ),
              jobField: await this.jobFieldService.findById(variable.fieldsId),
              user: await this.userService.findById(createBy),
              workType: await this.workTypeService.findById(
                variable.workTypesId,
              ),
            }),
          );

          const placements = await Promise.all(
            variable.placements.map(async (placement) => {
              return await this.placementService.findById(placement);
            }),
          );

          await Promise.all(
            placements.map(async (placement) => {
              await transactionalEntityManager.save(
                JobsPlacement,
                this.jobPlacementRepository.create({
                  job: newJobRecord,
                  jobsId: newJobRecord.id,
                  placement: placement,
                  placementsId: placement.id,
                  createAt: new Date().toString(),
                  createBy,
                }),
              );
            }),
          );
        },
      );

      return newJobRecord;
    } catch (error) {
      this.logger.log(error);
      return null;
    }
  }
}
