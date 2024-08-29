import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUsersJobFieldDto } from 'src/dto/users_job_fields/create-users_job_field.dto';
import { UpdateUsersJobFieldDto } from 'src/dto/users_job_fields/update-users_job_field.dto';
import { UsersJobFieldsService } from '../../services/users_job_fields.service';

@Controller('users-job-fields')
export class UsersJobFieldsController {
  constructor(private readonly usersJobFieldsService: UsersJobFieldsService) {}

  @Post()
  create(@Body() createUsersJobFieldDto: CreateUsersJobFieldDto) {
    return this.usersJobFieldsService.create(createUsersJobFieldDto);
  }

  @Get()
  findAll() {
    return this.usersJobFieldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersJobFieldsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersJobFieldDto: UpdateUsersJobFieldDto,
  ) {
    return this.usersJobFieldsService.update(+id, updateUsersJobFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersJobFieldsService.remove(+id);
  }
}
