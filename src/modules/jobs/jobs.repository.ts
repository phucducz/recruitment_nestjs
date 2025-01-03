import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  In,
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
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
import { Job } from 'src/entities/job.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { Placement } from 'src/entities/placement.entity';
import { Status } from 'src/entities/status.entity';

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
      relations: [...jobRelations.entites, 'creator', 'updater'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.JOB, removeColumns),
        ...jobSelectRelationColumns,
        creator: { id: true, fullName: true },
        updater: { id: true, fullName: true },
        jobsPlacements: {
          ...jobSelectRelationColumns.jobsPlacements,
          placement: this.placementSelectColumns,
        },
      },
    };
  }

  async findAll(jobsQueries: IJobQueries): Promise<[Job[], number]> {
    const {
      categoriesId,
      jobFieldsId,
      page,
      pageSize,
      salaryMax,
      salaryMin,
      title,
      workTypesId,
      usersId,
      statusId,
      jobsId,
      type = 'less',
    } = jobsQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });
    const placementIds = jobsQueries?.placementIds
      ? jobsQueries.placementIds.split(',')
      : [];

    const [jobs, totalItems] = await this.jobRepository.findAndCount({
      ...paginationParams,
      where: {
        ...(statusId && { status: { id: +statusId } }),
        ...(title && { title: Raw((value) => `${value} ILIKE '%${title}%'`) }),
        ...(salaryMin && {
          salaryMin: Raw((value) => `${value} >= ${+salaryMin}`),
        }),
        ...(salaryMax && {
          salaryMax: Raw((value) => `${value} <= ${+salaryMax}`),
        }),
        ...(categoriesId && { jobCategory: { id: +categoriesId } }),
        ...(jobFieldsId && { jobField: { id: +jobFieldsId } }),
        ...(placementIds?.length > 0 && {
          jobsPlacements: {
            placementsId: In(
              placementIds.map((placement) => +placement.trim()),
            ),
          },
        }),
        ...(workTypesId && { workType: { id: +workTypesId } }),
        ...(usersId && { user: { id: +usersId } }),
        ...(jobsId && { id: +jobsId }),
      },
      select: { id: true },
    });

    const result = await this.jobRepository.find({
      where: { id: In(jobs.map((job) => job.id)) },
      relations:
        type === 'more'
          ? this.generateJobRelationships().relations
          : ['user', 'creator', 'updater'],
      select:
        type === 'more'
          ? {
              ...this.generateJobRelationships().select,
              ...jobSelectColumns,
              createBy: false,
              updateBy: false,
              deleteAt: false,
              deleteBy: false,
            }
          : {
              id: true,
              title: true,
              creator: { id: true, fullName: true },
              updater: { id: true, fullName: true },
              user: { id: true, fullName: true, companyName: true },
            },
      order: { id: 'ASC' },
    });

    return [result, totalItems];
  }

  async findAllForEmployer(
    jobsQueries: IFIndJobsForEmployerQueries & {
      usersId: number;
      status?: Status[];
    },
  ): Promise<[Job[], number]> {
    const { title, usersId, status } = jobsQueries;
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
        'status.title as status',
        ...(status &&
          status.map(
            (status) =>
              `COUNT(CASE WHEN uj_status.title = '${status.title}' THEN 1 END) as ${status.code}_count`,
          )),
      ])
      .leftJoin('job.user', 'user')
      .leftJoin('job.workType', 'workType')
      .leftJoin('job.jobCategory', 'jobCategory')
      .leftJoin('job.usersJobs', 'usersJobs', 'job.id = usersJobs.jobsId')
      .leftJoin('job.status', 'status')
      .leftJoin('usersJobs.status', 'uj_status')
      .where('job.users_id = :usersId', { usersId })
      .andWhere('status.id = :statusId', {
        statusId: +(jobsQueries.statusId ?? '5'),
      })
      .groupBy(
        'job.id, job.title, job.createAt, job.updateAt, job.salaryMin, job.salaryMax, job.quantity, user.fullName, workType.title, jobCategory.name, job.status, status.title, status.id',
      );

    if (jobsQueries.title)
      queryBuilder.andWhere('job.title = :title', { title });
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
          | 'jobCategory'
          | 'jobPosition'
          | 'jobField'
          | 'user'
          | 'workType'
          | 'status'
        >
    >,
  ): Promise<Job> {
    const { createBy, variable, transactionalEntityManager } = createJob;
    const createParams = {
      applicationDeadline: variable.deadline,
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
      status: variable.status,
      createBy,
      createAt: new Date().toString(),
    } as Partial<Job>;

    if (transactionalEntityManager)
      return await (transactionalEntityManager as EntityManager).save(
        Job,
        createParams,
      );

    return await this.jobRepository.save(createParams);
  }

  // async create(
  //   createJob: ICreate<
  //     CreateJobDto &
  //       Pick<
  //         Job,
  //         | 'jobCategory'
  //         | 'jobPosition'
  //         | 'jobField'
  //         | 'user'
  //         | 'workType'
  //         | 'status'
  //       > & { placements: Placement[] }
  //   >,
  // ) {
  //   try {
  //     const { createBy, variable } = createJob;
  //     let newJobRecord: Job | null = null;

  //     await this.dataSource.manager.transaction(
  //       async (transactionalEntityManager) => {
  //         newJobRecord = await transactionalEntityManager.save(
  //           Job,
  //           this.jobRepository.create({
  //   applicationDeadline: variable.deadline,
  //   createAt: new Date().toString(),
  //   createBy,
  //   description: variable.description,
  //   minExpYearRequired: variable.minExpYearRequired,
  //   salaryMax: variable.salaryMax,
  //   requirements: variable.requirements,
  //   maxExpYearRequired: variable.maxExpYearRequired,
  //   salaryMin: variable.salaryMin,
  //   title: variable.title,
  //   benefits: variable.benefits,
  //   salaryCurrency: variable.salaryCurrency,
  //   quantity: variable.quantity,
  //   jobCategory: variable.jobCategory,
  //   jobPosition: variable.jobPosition,
  //   jobField: variable.jobField,
  //   user: variable.user,
  //   workType: variable.workType,
  // }),
  //         );

  //         await Promise.all(
  //           variable.placements.map((placement) => {
  //             transactionalEntityManager.save(
  //               JobsPlacement,
  //               this.jobPlacementRepository.create({
  //                 job: newJobRecord,
  //                 jobsId: newJobRecord.id,
  //                 placement: placement,
  //                 placementsId: placement.id,
  //                 createAt: new Date().toString(),
  //                 createBy,
  //               }),
  //             );
  //           }),
  //         );
  //       },
  //     );

  //     return newJobRecord;
  //   } catch (error) {
  //     this.logger.log(error);
  //     return null;
  //   }
  // }

  async update(
    id: number,
    updateJob: IUpdate<
      UpdateJobDto & { deleteAt?: string; deleteBy?: number } & Partial<
          Pick<
            Job,
            'jobCategory' | 'jobPosition' | 'jobField' | 'workType' | 'status'
          > & {
            placements: Placement[];
          }
        >
    >,
  ) {
    const { updateBy, variable, transactionalEntityManager } = updateJob;

    const variables = {
      ...variable,
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

  async delete(
    deleteJobDto: ISoftDelete<{ id: number } & Pick<Job, 'status'>>,
  ) {
    const { variable, transactionalEntityManager, deleteBy } = deleteJobDto;

    const updateParams = {
      deleteAt: new Date().toString(),
      deleteBy,
      status: variable.status,
    } as Partial<Job>;

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
