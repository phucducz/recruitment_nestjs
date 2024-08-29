import { Injectable } from '@nestjs/common';

import { CreateUsersJobFieldDto } from 'src/dto/users_job_fields/create-users_job_field.dto';
import { UpdateUsersJobFieldDto } from 'src/dto/users_job_fields/update-users_job_field.dto';

@Injectable()
export class UsersJobFieldsService {
  create(createUsersJobFieldDto: CreateUsersJobFieldDto) {
    return 'This action adds a new usersJobField';
  }

  findAll() {
    return `This action returns all usersJobFields`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersJobField`;
  }

  update(id: number, updateUsersJobFieldDto: UpdateUsersJobFieldDto) {
    return `This action updates a #${id} usersJobField`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersJobField`;
  }
}
