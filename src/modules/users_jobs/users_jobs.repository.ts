import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  EntityManager,
  FindOptionsWhere,
  Raw,
  Repository,
  UpdateResult,
} from 'typeorm';

import dayjs from 'dayjs';
import {
  CVSelectColumns,
  ENTITIES,
  jobSelectColumns,
  jobSelectRelationColumns,
  months,
  removeColumns,
} from 'src/common/utils/constants';
import { APPLICANT_SOURCES } from 'src/common/utils/enums';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { Job } from 'src/entities/job.entity';
import { UsersJob } from 'src/entities/users_job.entity';

@Injectable()
export class UsersJobRepository {
  constructor(
    @InjectRepository(UsersJob)
    private readonly usersJobRepository: Repository<UsersJob>,
  ) {}

  generateUsersJobSelect(rmColumns: string[]) {
    return filterColumns(ENTITIES.FIELDS.USERS_JOB, rmColumns);
  }

  async create(
    createUsersJobDto: ICreate<
      CreateUsersJobDto & Pick<UsersJob, 'curriculumVitae' | 'status'>
    >,
  ) {
    const { createBy, variable } = createUsersJobDto;

    return (await this.usersJobRepository.save({
      createAt: new Date().toString(),
      createBy,
      jobsId: +variable.jobsId,
      usersId: createBy,
      curriculumVitae: variable.curriculumVitae,
      status: variable.status,
    })) as UsersJob;
  }

  async isExist(params: { jobsId: number; usersId: number }) {
    return !!(await this.usersJobRepository.findOneBy(params));
  }

  async findAppliedJobsByUserId(appliedJobQueries: IAppliedJobQueries) {
    const { usersId, page, pageSize } = appliedJobQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.usersJobRepository.findAndCount({
      where: { usersId },
      relations: ['curriculumVitae', 'job', 'status', 'job.user'],
      select: {
        job: {
          ...jobSelectRelationColumns,
          ...jobSelectColumns,
          createAt: false,
          createBy: false,
          updateAt: false,
          updateBy: false,
          status: filterColumns(ENTITIES.FIELDS.STATUS, removeColumns),
          user: filterColumns(ENTITIES.FIELDS.USER, [
            ...removeColumns,
            'password',
          ]),
        },
        ...this.generateUsersJobSelect(removeColumns),
        createAt: true,
        curriculumVitae: CVSelectColumns,
      },
      ...paginationParams,
      order: { createAt: 'DESC' },
    });
  }

  async findApplicantsForJob(findApplicantsForJob: IFindApplicantsQueries) {
    const { usersId, page, pageSize, applicantName, source, jobsId, statusId } =
      findApplicantsForJob;
    const paginationParams = getPaginationParams({ page, pageSize });
    const sevenDaysAgo = dayjs()
      .subtract(7, 'day')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    const today = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');

    return await this.usersJobRepository.findAndCount({
      where: {
        job: { user: { id: usersId } } as FindOptionsWhere<Job>,
        ...(applicantName && {
          user: {
            fullName: Raw((value) => `${value} ILIKE '%${applicantName}%'`),
          },
        }),
        ...(source && {
          referrerId: Raw((value) =>
            source === APPLICANT_SOURCES.ADDED_BY_EMPLOYEE
              ? `${value} IS NOT NULL`
              : `${value} IS NULL`,
          ),
        }),
        ...(jobsId && { jobsId: +jobsId }),
        ...(statusId && { status: { id: +statusId } }),
        ...(findApplicantsForJob.type &&
          findApplicantsForJob.type === 'new' && {
            createAt: Between(sevenDaysAgo, today),
          }),
      },
      relations: ['job', 'user', 'status', 'schedules'],
      select: {
        user: { fullName: true, id: true, avatarUrl: true },
        job: { title: true, id: true },
        schedules: filterColumns(ENTITIES.FIELDS.SCHEDULE, removeColumns),
        ...this.generateUsersJobSelect([]),
        createAt: true,
        status: filterColumns(ENTITIES.FIELDS.STATUS, removeColumns),
      },
      ...paginationParams,
    });
  }

  async findApplicantDetail(
    findApplicantDetailQueries: IFindApplicantDetailQueries,
  ) {
    return await this.usersJobRepository.findOne({
      where: {
        usersId: +findApplicantDetailQueries.usersId,
        jobsId: +findApplicantDetailQueries.jobsId,
      },
      relations: ['job', 'user', 'status', 'curriculumVitae'],
      select: {
        createAt: true,
        updateAt: true,
        ...this.generateUsersJobSelect([
          'cvViewedAt',
          'referrerId',
          'employerUpdateBy',
        ]),
        user: { id: true, fullName: true },
        job: { title: true, id: true },
        curriculumVitae: filterColumns(ENTITIES.FIELDS.CURRICULUM_VITAE, [
          ...removeColumns,
          'isDeleted',
        ]),
        status: filterColumns(ENTITIES.FIELDS.STATUS, removeColumns),
      },
    });
  }

  async findByCompositePrKey(params: { usersId: number; jobsId: number }) {
    return await this.usersJobRepository.findOne({
      where: { usersId: params.usersId, jobsId: params.jobsId },
    });
  }

  async update(
    updateUsersJobDto: IUpdateMTM<
      UpdateUsersJobDto & Partial<UsersJob>,
      { jobsId: number; usersId: number }
    >,
  ) {
    const { variable, queries, transactionalEntityManager } = updateUsersJobDto;
    const updateParams = {
      ...[
        'employerUpdateBy',
        'employerUpdateAt',
        'updateBy',
        'updateAt',
        'status',
        'cvViewedAt',
      ].reduce((acc, key) => {
        if (variable[key]) acc[key] = variable[key];

        return acc;
      }, {} as UsersJob),
    };
    let updateResult = { affected: 0 } as UpdateResult;

    if (transactionalEntityManager)
      updateResult = await (transactionalEntityManager as EntityManager).update(
        UsersJob,
        queries,
        updateParams,
      );
    else
      updateResult = await this.usersJobRepository.update(
        queries,
        updateParams,
      );

    return updateResult.affected > 0;
  }

  async getMonthlyCandidateStatisticsByYear(year: string) {
    return await this.usersJobRepository
      .createQueryBuilder('uj')
      .select(
        months
          .number()
          .map(
            (month, index) =>
              `COUNT(CASE WHEN EXTRACT(MONTH FROM create_at) = ${month} THEN 1 END) as ${months.name[index].toLowerCase()}`,
          )
          .join(', '),
      )
      .where('EXTRACT(YEAR FROM create_at) = :year', { year: year })
      .getRawOne();
  }
}