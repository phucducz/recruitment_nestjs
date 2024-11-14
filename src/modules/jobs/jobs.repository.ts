import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  Raw,
  Repository,
} from 'typeorm';

import { JobConverter } from 'src/common/converters/job.converter';
import {
  ENTITIES,
  jobRelations,
  jobSelectColumns,
  jobSelectRelationColumns,
  removeColumns,
} from 'src/common/utils/constants';
import { JOB_STATUS } from 'src/common/utils/enums';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
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
        ...filterColumns(ENTITIES.FIELDS.JOB, [
          'updateBy',
          'createBy',
          'deleteAt',
          'deleteBy',
        ]),
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
        status: JOB_STATUS.ACTIVE,
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
        updateBy: false,
        deleteAt: false,
        deleteBy: false,
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
        'job.id as id',
        'job.title as job_title',
        'job.createAt as job_create_at',
        'job.updateAt as job_update_at',
        'job.salaryMin as job_salary_min',
        'job.salaryMax as job_salary_max',
        'job.quantity as job_quantity',
        'user.fullName as user_full_name',
        'workType.title as work_type_title',
        'job.status as jobStatus',
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
      .andWhere('job.status <> :status', { status: JOB_STATUS.DELETED })
      .groupBy(
        'job.id, job.title, job.createAt, job.updateAt, job.salaryMin, job.salaryMax, job.quantity, user.fullName, workType.title, jobCategory.name, job.status',
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
      where: { id: id, status: JOB_STATUS.ACTIVE },
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
      UpdateJobDto & { deleteAt?: string; deleteBy?: number } & Partial<
          Pick<Job, 'jobCategory' | 'jobPosition' | 'jobField' | 'workType'> & {
            placements: Placement[];
          }
        >
    >,
  ) {
    const { updateBy, variable, transactionalEntityManager } = updateJob;

    const variables = {
      ...(variable.salaryMin && { salaryMin: variable.salaryMin }),
      ...(variable.salaryMax && { salaryMax: variable.salaryMax }),
      ...(variable.quantity && { quantity: variable.quantity }),
      ...(variable.description && { description: variable.description }),
      ...(variable.requirements && { requirements: variable.requirements }),
      ...(variable.benefits && { benefits: variable.benefits }),
      ...(variable.jobField && { jobField: variable.jobField }),
      ...(variable.jobCategory && { jobCategory: variable.jobCategory }),
      ...(variable.workType && { workType: variable.workType }),
      ...(variable.jobPosition && { jobPosition: variable.jobPosition }),
      ...(variable.status && { status: variable.status }),
      ...(typeof variable.deleteAt !== 'undefined' && { deleteAt: null }),
      ...(typeof variable.deleteBy !== 'undefined' && { deleteBy: null }),
      updateBy,
      updateAt: new Date().toString(),
    } as Job;

    if (transactionalEntityManager) {
      const result = await (transactionalEntityManager as EntityManager).update(
        Job,
        id,
        variables,
      );

      return result.affected > 0;
    }

    return (await this.jobRepository.update(id, variables)).affected > 0;
  }

  async delete(deleteJobDto: ISoftDelete<{ id: number }>) {
    const { variable, transactionalEntityManager, deleteBy } = deleteJobDto;

    const updateParams = {
      deleteAt: new Date().toString(),
      deleteBy,
      status: JOB_STATUS.DELETED,
    };

    if (transactionalEntityManager) {
      const result = await (transactionalEntityManager as EntityManager).update(
        Job,
        variable.id,
        updateParams,
      );

      return result.affected > 0;
    }

    return (
      (await this.jobRepository.update(variable.id, updateParams)).affected > 0
    );
  }
}
