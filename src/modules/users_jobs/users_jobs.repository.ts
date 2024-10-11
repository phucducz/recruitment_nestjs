import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { CurriculumVitae } from 'src/entities/curriculum_vitae';
import { UsersJob } from 'src/entities/users_job.entity';

@Injectable()
export class UsersJobRepository {
  constructor(
    @InjectRepository(UsersJob)
    private readonly usersJobRepository: Repository<UsersJob>,
  ) {}

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
}
