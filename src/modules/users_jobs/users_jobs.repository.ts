import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';

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

  async findApplicantsForJob(findApplicantsForJob: IFindApplicantsQueries) {
    const { usersId, page, pageSize, applicantName, source } =
      findApplicantsForJob;
    const paginationParams = getPaginationParams({ page, pageSize });

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
      },
      relations: ['job', 'user', 'applicationStatus', 'job.user'],
      select: {
        user: { fullName: true, id: true },
        job: { title: true, id: true },
        ...this.generateUsersJobSelect([]),
        createAt: true,
        applicationStatus: filterColumns(
          ENTITIES.FIELDS.APPLICATION_STATUS,
          removeColumns,
        ),
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
