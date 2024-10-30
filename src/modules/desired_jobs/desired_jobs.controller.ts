import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateDesiredJobDto } from 'src/dto/desired_jobs/create-desired_job.dto';
import { UpdateDesiredJobDto } from 'src/dto/desired_jobs/update-desired_job.dto';
import { DesiredJobsService } from '../../services/desired_jobs.service';

@Controller('desired-jobs')
export class DesiredJobsController {
  constructor(private readonly desiredJobsService: DesiredJobsService) {}

  @Post()
  create(@Body() createDesiredJobDto: CreateDesiredJobDto) {
    return this.desiredJobsService.create(createDesiredJobDto);
  }

  @Get()
  findAll() {
    return this.desiredJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desiredJobsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDesiredJobDto: UpdateDesiredJobDto,
  ) {
    return this.desiredJobsService.update(+id, updateDesiredJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desiredJobsService.remove(+id);
  }
}
