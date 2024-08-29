import { Injectable } from '@nestjs/common';

import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';

@Injectable()
export class UsersJobsService {
  create(createUsersJobDto: CreateUsersJobDto) {
    return 'This action adds a new usersJob';
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
