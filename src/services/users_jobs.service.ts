import { Inject, Injectable } from '@nestjs/common';

import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { UsersJobRepository } from 'src/modules/users_jobs/users_jobs.repository';

@Injectable()
export class UsersJobsService {
  constructor(
    @Inject(UsersJobRepository)
    private readonly usersJobRepository: UsersJobRepository,
  ) {}

  async create(createUsersJobDto: ICreate<CreateUsersJobDto>) {
    return await this.usersJobRepository.create(createUsersJobDto);
  }

  findAll() {
    return `This action returns all usersJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersJob`;
  }

  update(id: number, updateUsersJobDto: UpdateUsersJobDto) {
    return `This action updates a #${id} usersJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersJob`;
  }
}
