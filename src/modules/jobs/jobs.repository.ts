import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Raw, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
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
            variable.placements.map(async (placement) => {
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
