import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobFieldsService } from './job_fields.service';
import { CreateJobFieldDto } from './dto/create-job_field.dto';
import { UpdateJobFieldDto } from './dto/update-job_field.dto';

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
  update(@Param('id') id: string, @Body() updateJobFieldDto: UpdateJobFieldDto) {
    return this.jobFieldsService.update(+id, updateJobFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobFieldsService.remove(+id);
  }
}
