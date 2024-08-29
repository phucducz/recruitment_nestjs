import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersJobsService } from './users_jobs.service';
import { CreateUsersJobDto } from './dto/create-users_job.dto';
import { UpdateUsersJobDto } from './dto/update-users_job.dto';

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
  update(@Param('id') id: string, @Body() updateUsersJobDto: UpdateUsersJobDto) {
    return this.usersJobsService.update(+id, updateUsersJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersJobsService.remove(+id);
  }
}
