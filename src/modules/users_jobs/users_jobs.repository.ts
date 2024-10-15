import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CVSelectColumns,
  ENTITIES,
  jobSelectColumns,
  jobSelectRelationColumns,
  removeColumns,
} from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { CurriculumVitae } from 'src/entities/curriculum_vitae';
import { UsersJob } from 'src/entities/users_job.entity';

@Injectable()
export class UsersJobRepository {
  constructor(
    @InjectRepository(UsersJob)
    private readonly usersJobRepository: Repository<UsersJob>,
  ) {}

  private readonly usersJobSelect = filterColumns(
    ENTITIES.FIELDS.USERS_JOB,
    removeColumns,
  );

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
        ...this.usersJobSelect,
        createAt: true,
        curriculumVitae: CVSelectColumns,
      },
      ...paginationParams,
      order: { createAt: 'DESC' },
    });
  }
}
