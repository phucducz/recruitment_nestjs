import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Raw, Repository } from 'typeorm';

import { JobConverter } from 'src/common/converters/job.converter';
import {
  ENTITIES,
  jobRelations,
  jobSelectColumns,
  jobSelectRelationColumns,
  removeColumns,
} from 'src/common/utils/constants';
import {
  filterColumns,
  filterUndefinedValues,
  getPaginationParams,
} from 'src/common/utils/function';
import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
import { Job } from 'src/entities/job.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { Placement } from 'src/entities/placement.entity';

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @Inject(DataSource) private readonly dataSource: DataSource,
    @InjectRepository(JobsPlacement)
    private readonly jobPlacementRepository: Repository<JobsPlacement>,
    @Inject(JobConverter) private readonly jobConverter: JobConverter,
  ) {}

  private readonly logger = new Logger(JobsRepository.name);

  private readonly placementSelectColumns = filterColumns(
    ENTITIES.FIELDS.PLACEMENT,
    removeColumns,
  );

  generateJobRelationships(): Pick<
    FindManyOptions<Job>,
    'select' | 'relations'
  > {
    return {
      relations: jobRelations.entites,
      select: {
        ...jobSelectRelationColumns,
        jobsPlacements: {
          ...jobSelectRelationColumns.jobsPlacements,
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
      usersId,
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
        ...(usersId && { user: { id: +usersId } }),
      },
      relations: this.generateJobRelationships().relations,
      select: {
        ...this.generateJobRelationships().select,
        ...jobSelectColumns,
        createBy: false,
        updateAt: false,
        updateBy: false,
      },
      order: { createAt: 'DESC' },
    });
  }

  async findAllForEmployer(
    jobsQueries: IFIndJobsForEmployerQueries & { usersId: number },
  ): Promise<[Job[], number]> {
    const { applicationStatusId, title, usersId } = jobsQueries;
    const { skip, take } = getPaginationParams({
      page: +jobsQueries.page,
      pageSize: +jobsQueries.pageSize,
    });
    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .select([
        'job.title as job_title',
        'job.createAt as job_create_at',
        'job.updateAt as job_update_at',
        'job.salaryMin as job_salary_min',
        'job.salaryMax as job_salary_max',
        'job.quantity as job_quantity',
        'user.fullName as user_full_name',
        'workType.title as work_type_title',
        'jobCategory.name as job_category_name',
        "COUNT(CASE WHEN applicationStatus.title = 'Đang đánh giá' THEN 1 END) as evaluating_count",
        "COUNT(CASE WHEN applicationStatus.title = 'Đang offer' THEN 1 END) as offering_count",
        "COUNT(CASE WHEN applicationStatus.title = 'Đang phỏng vấn' THEN 1 END) as interviewing_count",
        "COUNT(CASE WHEN applicationStatus.title = 'Đang tuyển' THEN 1 END) as recruiting_count",
      ])
      .leftJoin('job.user', 'user')
      .leftJoin('job.workType', 'workType')
      .leftJoin('job.jobCategory', 'jobCategory')
      .leftJoin('job.usersJobs', 'usersJobs', 'job.id = usersJobs.jobsId')
      .leftJoin('usersJobs.applicationStatus', 'applicationStatus')
      .where('job.users_id = :usersId', { usersId })
      .groupBy(
        'job.title, job.createAt, job.updateAt, job.salaryMin, job.salaryMax, job.quantity, user.fullName, workType.title, jobCategory.name',
      );

    if (jobsQueries.applicationStatusId)
      queryBuilder.andWhere('applicationStatus.id = :applicationStatusId', {
        applicationStatusId,
      });
    if (jobsQueries.title)
      queryBuilder.andWhere('job.title = :title', {
        title,
      });
    if (skip) queryBuilder.skip(skip);
    if (take) queryBuilder.take(take);

    const result = await Promise.all([
      (await queryBuilder.getRawMany()).map((raw) =>
        this.jobConverter.toCamelCase(raw as Job),
      ),
      queryBuilder.getCount(),
    ]);

    return result;
  }

  async findById(id: number) {
    return await this.jobRepository.findOne({
      where: { id: id },
      ...this.generateJobRelationships(),
    });
  }

  async create(
    createJob: ICreate<
      CreateJobDto &
        Pick<
          Job,
          'jobCategory' | 'jobPosition' | 'jobField' | 'user' | 'workType'
        > & { placements: Placement[] }
    >,
  ) {
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
              jobCategory: variable.jobCategory,
              jobPosition: variable.jobPosition,
              jobField: variable.jobField,
              user: variable.user,
              workType: variable.workType,
            }),
          );

          await Promise.all(
            variable.placements.map((placement) => {
              transactionalEntityManager.save(
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

  async update(
    id: number,
    updateJob: IUpdate<
      UpdateJobDto &
        Partial<
          Pick<Job, 'jobCategory' | 'jobPosition' | 'jobField' | 'workType'> & {
            placements: Placement[];
          }
        >
    >,
  ) {
    try {
      const { updateBy, variable } = updateJob;

      await this.dataSource.transaction(async (transactionalEntityManager) => {
        const newVariables = filterUndefinedValues<Job>({
          salaryMin: variable.salaryMin,
          salaryMax: variable.salaryMax,
          quantity: variable.quantity,
          description: variable.description,
          requirements: variable.requirements,
          benefits: variable.benefits,
          jobField: variable.jobField,
          jobCategory: variable.jobCategory,
          workType: variable.workType,
          jobPosition: variable.jobPosition,
          updateBy,
          updateAt: new Date().toString(),
        });

        console.log({
          salaryMin: variable.salaryMin,
          salaryMax: variable.salaryMax,
          quantity: variable.quantity,
          description: variable.description,
          requirements: variable.requirements,
          benefits: variable.benefits,
          jobField: variable.jobField,
          jobCategory: variable.jobCategory,
          workType: variable.workType,
          jobPosition: variable.jobPosition,
          updateBy,
          updateAt: new Date().toString(),
        });

        await transactionalEntityManager.update(Job, id, newVariables);

        if ((variable?.placementIds ?? []).length > 0) {
          const currentJob = await this.findById(id);

          await transactionalEntityManager.delete(JobsPlacement, {
            jobsId: currentJob.id,
          });

          await Promise.all(
            variable.placements.map(async (placement) => {
              await transactionalEntityManager.save(
                JobsPlacement,
                this.jobPlacementRepository.create({
                  job: currentJob,
                  jobsId: id,
                  placement: placement,
                  placementsId: placement.id,
                  createAt: new Date().toString(),
                  createBy: updateBy,
                }),
              );
            }),
          );
        }
      });
      return { isSuccess: true, message: '' };
    } catch (error) {
      return { isSuccess: true, message: error };
    }
  }
}
