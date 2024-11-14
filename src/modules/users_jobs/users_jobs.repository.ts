import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UsersJobConverter } from 'src/common/converters/users_jobs.converter';
import {
  CVSelectColumns,
  ENTITIES,
  jobSelectColumns,
  jobSelectRelationColumns,
  removeColumns,
} from 'src/common/utils/constants';
import { APPLICANT_SOURCES } from 'src/common/utils/enums';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { CurriculumVitae } from 'src/entities/curriculum_vitae';
import { UsersJob } from 'src/entities/users_job.entity';

@Injectable()
export class UsersJobRepository {
  constructor(
    @InjectRepository(UsersJob)
    private readonly usersJobRepository: Repository<UsersJob>,
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(UsersJobConverter)
    private readonly usersJobConverter: UsersJobConverter,
  ) {}

  generateUsersJobSelect(rmColumns: string[]) {
    return filterColumns(ENTITIES.FIELDS.USERS_JOB, rmColumns);
  }

  async create(
    createUsersJobDto: ICreate<
      CreateUsersJobDto & { curriculumVitae: CurriculumVitae }
    >,
  ) {
    const { createBy, variable } = createUsersJobDto;

    return (await this.usersJobRepository.save({
      createAt: new Date().toString(),
      createBy,
      jobsId: variable.jobsId,
      usersId: createBy,
      curriculumVitae: variable.curriculumVitae,
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
      relations: ['curriculumVitae', 'job', 'job.user'],
      select: {
        job: {
          ...jobSelectRelationColumns,
          ...jobSelectColumns,
          createAt: false,
          createBy: false,
          updateAt: false,
          updateBy: false,
        },
        ...this.generateUsersJobSelect(removeColumns),
        createAt: true,
        curriculumVitae: CVSelectColumns,
      },
      ...paginationParams,
      order: { createAt: 'DESC' },
    });
  }

  async findApplicantsForJob(
    findApplicantsForJob: IFindApplicantsQueries,
  ): Promise<[Record<string, any>[], number]> {
    const { usersId, applicantName, source, jobsId } = findApplicantsForJob;
    const paginationParams = getPaginationParams({
      page: findApplicantsForJob.page,
      pageSize: findApplicantsForJob.pageSize,
    });

    const queryParams: any = [usersId];
    let whereClause = 'WHERE job_users_id = $1 ';

    if (applicantName) {
      queryParams.push(`%${applicantName}%`);
      whereClause += 'AND full_name ILIKE $2 ';
    }
    if (jobsId) {
      queryParams.push(jobsId);
      whereClause += `AND jobs_id = $${queryParams.length} `;
    }
    if (source)
      whereClause +=
        source === APPLICANT_SOURCES.ADDED_BY_EMPLOYEE
          ? 'AND referrer_id IS NOT NULL'
          : 'AND referrer_id IS NULL';

    queryParams.push(paginationParams.take, paginationParams.skip);

    const result = (await this.dataSource.query(
      `
      WITH combine_data AS (
        SELECT 
          u.id as users_id, u.full_name as full_name, j.id as  jobs_id, j.title as job_title, 
          null as job_recommendations_id, uj.cv_viewed_at cv_viewed_at, uj.create_at as create_at, 
          uj.referrer_id as referrer_id, uj.employer_update_by as employer_update_by, 
          uj.employer_update_at as employer_update_at, ast.id as application_status_id, 
          ast.title as application_status_title, j.users_id as  job_users_id
        FROM jobs as j
        LEFT JOIN users_jobs as uj ON uj.jobs_id = j.id
        LEFT JOIN users as u ON u.id = uj.users_id
        LEFT JOIN application_status as ast ON uj.application_status_id = ast.id
        UNION ALL
        SELECT 
          null as users_id, jr.full_name as full_name, j.id as  jobs_id, j.title as job_title, 
          jr.id as job_recommendations_id, jr.cv_viewed_at cv_viewed_at, jr.create_at as create_at, 
          jr.create_by as referrer_id, jr.employer_update_by as employer_update_by, 
          jr.employer_update_at as employer_update_at, ast.id as application_status_id, 
          ast.title as application_status_title, j.users_id as  job_users_id
        FROM jobs as j, job_recommendations as jr, application_status as ast
        WHERE jr.jobs_id = j.id and jr.applications_id = ast.id
      )
      SELECT 
        cd.*, 
        (SELECT COUNT(*) FROM combine_data WHERE job_users_id = 4) as total_items
      FROM combine_data as cd
      ${whereClause}
      ORDER BY create_at DESC
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length};
    `,
      queryParams,
    )) as Record<string, any>[];

    return [
      result.map((item) => this.usersJobConverter.toCamelCase(item)),
      Number(result[0]?.total_items ?? '0'),
    ];
  }

  // async findApplicantsForJob(findApplicantsForJob: IFindApplicantsQueries) {
  //   const { usersId, page, pageSize, applicantName, source } =
  //     findApplicantsForJob;
  //   const paginationParams = getPaginationParams({ page, pageSize });

  //   return await this.usersJobRepository.findAndCount({
  //     where: {
  //       job: { user: { id: usersId } } as FindOptionsWhere<Job>,
  //       ...(applicantName && {
  //         user: {
  //           fullName: Raw((value) => `${value} ILIKE '%${applicantName}%'`),
  //         },
  //       }),
  //       ...(source && {
  //         referrerId: Raw((value) =>
  //           source === APPLICANT_SOURCES.ADDED_BY_EMPLOYEE
  //             ? `${value} IS NOT NULL`
  //             : `${value} IS NULL`,
  //         ),
  //       }),
  //     },
  //     relations: ['job', 'user', 'applicationStatus'],
  //     select: {
  //       job: { title: true, id: true },
  //       ...this.generateUsersJobSelect([]),
  //       user: { fullName: true, id: true },
  //       createAt: true,
  //       applicationStatus: filterColumns(
  //         ENTITIES.FIELDS.APPLICATION_STATUS,
  //         removeColumns,
  //       ),
  //     },
  //     ...paginationParams,
  //   });
  // }

  async findApplicantDetail(
    findApplicantDetailQueries: IFindApplicantDetailQueries,
  ) {
    return await this.usersJobRepository.findOne({
      where: {
        usersId: +findApplicantDetailQueries.usersId,
        jobsId: +findApplicantDetailQueries.jobsId,
      },
      relations: ['job', 'applicationStatus', 'curriculumVitae', 'schedules'],
      select: {
        createAt: true,
        updateAt: true,
        ...this.generateUsersJobSelect([
          'cvViewedAt',
          'referrerId',
          'employerUpdateBy',
        ]),
        job: { title: true, id: true },
        curriculumVitae: filterColumns(ENTITIES.FIELDS.CURRICULUM_VITAE, [
          ...removeColumns,
          'isDeleted',
        ]),
        applicationStatus: filterColumns(
          ENTITIES.FIELDS.APPLICATION_STATUS,
          removeColumns,
        ),
        schedules: filterColumns(ENTITIES.FIELDS.SCHEDULE, removeColumns),
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
    const { variable, queries } = updateUsersJobDto;

    const result = await this.usersJobRepository.update(queries, {
      ...[
        'employerUpdateBy',
        'employerUpdateAt',
        'updateBy',
        'updateAt',
        'applicationStatus',
      ].reduce((acc, key) => {
        if (variable[key]) acc[key] = variable[key];

        return acc;
      }, {} as UsersJob),
    });

    return result.affected > 0;
  }
}
