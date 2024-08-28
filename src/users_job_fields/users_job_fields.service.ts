import { Injectable } from '@nestjs/common';
import { CreateUsersJobFieldDto } from './dto/create-users_job_field.dto';
import { UpdateUsersJobFieldDto } from './dto/update-users_job_field.dto';

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
