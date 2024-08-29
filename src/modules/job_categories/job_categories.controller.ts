import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateJobCategoryDto } from 'src/dto/job_categories/create-job_category.dto';
import { UpdateJobCategoryDto } from 'src/dto/job_categories/update-job_category.dto';
import { JobCategoriesService } from '../../services/job_categories.service';

@Controller('job-categories')
export class JobCategoriesController {
  constructor(private readonly jobCategoriesService: JobCategoriesService) {}

  @Post()
  create(@Body() createJobCategoryDto: CreateJobCategoryDto) {
    return this.jobCategoriesService.create(createJobCategoryDto);
  }

  @Get()
  findAll() {
    return this.jobCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobCategoryDto: UpdateJobCategoryDto,
  ) {
    return this.jobCategoriesService.update(+id, updateJobCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobCategoriesService.remove(+id);
  }
}
