import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateJobFieldDto } from 'src/dto/job_fields/create-job_field.dto';
import { UpdateJobFieldDto } from 'src/dto/job_fields/update-job_field.dto';
import { JobFieldsService } from '../../services/job_fields.service';

@Controller('job-fields')
export class JobFieldsController {
  constructor(private readonly jobFieldsService: JobFieldsService) {}

  @Post()
  create(@Body() createJobFieldDto: CreateJobFieldDto) {
    return this.jobFieldsService.create(createJobFieldDto);
  }

  @Get()
  findAll() {
    return this.jobFieldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobFieldsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobFieldDto: UpdateJobFieldDto,
  ) {
    return this.jobFieldsService.update(+id, updateJobFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobFieldsService.remove(+id);
  }
}
