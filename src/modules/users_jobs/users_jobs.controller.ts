import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUsersJobDto } from 'src/dto/users_jobs/create-users_job.dto';
import { UpdateUsersJobDto } from 'src/dto/users_jobs/update-users_job.dto';
import { UsersJobsService } from '../../services/users_jobs.service';

@Controller('users-jobs')
export class UsersJobsController {
  constructor(private readonly usersJobsService: UsersJobsService) {}

  @Post()
  create(@Body() createUsersJobDto: CreateUsersJobDto) {
    return this.usersJobsService.create(createUsersJobDto);
  }

  @Get()
  findAll() {
    return this.usersJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersJobsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersJobDto: UpdateUsersJobDto,
  ) {
    return this.usersJobsService.update(+id, updateUsersJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersJobsService.remove(+id);
  }
}
