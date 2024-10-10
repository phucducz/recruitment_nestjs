import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UsersJob } from 'src/entities/users_job.entity';

@Injectable()
export class UsersJobRepository {
  constructor(
    @InjectRepository(UsersJob)
    private readonly usersJobRepository: Repository<UsersJob>,
  ) {}

  async create(createUsersJobDto: ICreate<CreateUsersJobDto>) {
    const { createBy, variable } = createUsersJobDto;

    return (await this.usersJobRepository.save({
      createAt: new Date().toString(),
      createBy,
      jobsId: variable.jobsId,
      usersId: createBy,
      curriculumVitaeLink: variable.curriculumVitaeURL,
    })) as UsersJob;
  }
}
