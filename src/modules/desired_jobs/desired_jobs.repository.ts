import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOneOptions,
  FindOptionsSelect,
  Repository,
  UpdateResult,
} from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class DesiredJobsRepository {
  constructor(
    @InjectRepository(DesiredJob)
    private readonly desiredJobRepository: Repository<DesiredJob>,
  ) {}

  private readonly userFields = filterColumns(ENTITIES.FIELDS.USER, [
    ...removeColumns,
    'password',
  ]) as FindOptionsSelect<User>;

  private readonly desiredJobSelect = filterColumns(
    ENTITIES.FIELDS.DESIRED_JOB,
    ['updateBy', 'updateAt', 'createBy', 'approveBy'],
  ) as FindOptionsSelect<DesiredJob>;

  private readonly desiredJobOptions = {
    relations: [
      'user',
      'status',
      'jobField',
      'creator',
      'updater',
      'approver',
      'desiredJobsPlacement',
      'desiredJobsPosition',
      'user.placement',
      'user.achivement',
      'user.userLanguages',
      'user.curriculumVitae',
      'user.workExperiences',
      'user.userLanguages.foreignLanguage',
      'desiredJobsPlacement.placement',
      'desiredJobsPosition.jobPosition',
    ],
    select: {
      ...this.desiredJobSelect,
      user: {
        ...this.userFields,
        achivement: { description: true },
        placement: { id: true, title: true },
        curriculumVitae: filterColumns(
          ENTITIES.FIELDS.CURRICULUM_VITAE,
          removeColumns,
        ),
        userLanguages: {
          usersId: true,
          foreignLanguage: filterColumns(
            ENTITIES.FIELDS.FOREIGN_LANGUAGE,
            removeColumns,
          ),
        },
      },
      desiredJobsPlacement: {
        desiredJobsId: true,
        placementsId: true,
        placement: { title: true },
      },
      desiredJobsPosition: {
        desiredJobsId: true,
        jobPositionsId: true,
        jobPosition: { title: true },
      },
      creator: { id: true, fullName: true },
      updater: { id: true, fullName: true },
      approver: { id: true, fullName: true },
      status: { id: true, code: true, title: true },
      jobField: {
        id: true,
        title: true,
      },
    },
  } as FindOneOptions<DesiredJob>;

  async create(
    createDesiredJobDto: ICreate<
      CreateDesiredJobDto & Pick<DesiredJob, 'jobField' | 'user' | 'status'>
    >,
  ) {
    const { createBy, variable, transactionalEntityManager } =
      createDesiredJobDto;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
      salarayExpectation: variable.salaryExpectation,
      startAfterOffer: variable.startAfterOffer,
      totalYearExperience: variable.totalYearExperience,
      yearOfBirth: variable.yearOfBirth,
      jobField: variable.jobField,
      status: variable.status,
      user: variable.user,
    };

    if (transactionalEntityManager)
      return (await transactionalEntityManager.save(
        DesiredJob,
        createParams,
      )) as DesiredJob;

    return (await this.desiredJobRepository.save(createParams)) as DesiredJob;
  }

  getDesiredJobRepository() {
    return this.desiredJobRepository;
  }

  async findAll(desiredJobsQueries: IFindDesiredJobsQueries) {
    const {
      id,
      page,
      pageSize,
      jobFieldsId,
      placementsId,
      totalYearExperience,
    } = desiredJobsQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.desiredJobRepository.findAndCount({
      where: {
        ...(id && { id }),
        ...(placementsId && {
          desiredJobsPlacement: {
            placement: { id: +placementsId },
          },
        }),
        ...(totalYearExperience && {
          totalYearExperience: +totalYearExperience,
        }),
        ...(jobFieldsId && { jobField: { id: +jobFieldsId } }),
      },
      order: { createAt: 'DESC' },
      ...this.desiredJobOptions,
      ...paginationParams,
    });
  }

  async findById(id: number) {
    return await this.desiredJobRepository.findOne({
      where: { id },
      ...this.desiredJobOptions,
    });
  }

  async findOneBy(options: FindOneOptions<DesiredJob>) {
    return await this.desiredJobRepository.findOne({
      ...options,
      ...this.desiredJobOptions,
    });
  }

  async approve(id: number, updateDesiredJobDto: IUpdate<UpdateDesiredJobDto>) {
    const { updateBy, variable, transactionalEntityManager } =
      updateDesiredJobDto;

    const paramsUpdate = {
      status: variable.status,
      rejectReason: variable.rejectReason,
      approveBy: updateBy,
      approveAt: new Date().toString(),
    } as Partial<DesiredJob>;

    let result = { affected: 0 } as UpdateResult;
    if (transactionalEntityManager)
      result = await (transactionalEntityManager as EntityManager).update(
        DesiredJob,
        id,
        paramsUpdate,
      );
    else result = await this.desiredJobRepository.update(id, paramsUpdate);

    return result;
  }

  async update(
    id: number,
    updateDesiredJobDto: IUpdate<
      UpdateDesiredJobDto & Pick<DesiredJob, 'jobField'>
    >,
  ) {
    const { updateBy, variable, transactionalEntityManager } =
      updateDesiredJobDto;

    const paramsUpdate = {
      ...(variable.salaryExpectation && {
        salarayExpectation: variable.salaryExpectation,
      }),
      ...(variable.startAfterOffer && {
        startAfterOffer: variable.startAfterOffer,
      }),
      ...(variable.jobField && { jobField: variable.jobField }),
      ...(variable.totalYearExperience && {
        totalYearExperience: variable.totalYearExperience,
      }),
      updateAt: new Date().toString(),
      updateBy,
    } as Partial<DesiredJob>;
    let result = { affected: 0 } as UpdateResult;

    if (transactionalEntityManager)
      result = await (transactionalEntityManager as EntityManager).update(
        DesiredJob,
        id,
        paramsUpdate,
      );
    else result = await this.desiredJobRepository.update(id, paramsUpdate);

    return result?.affected > 0;
  }
}
