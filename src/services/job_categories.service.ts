import { Injectable } from '@nestjs/common';

import { CreateJobCategoryDto } from 'src/dto/job_categories/create-job_category.dto';
import { UpdateJobCategoryDto } from 'src/dto/job_categories/update-job_category.dto';

@Injectable()
export class JobCategoriesService {
  create(createJobCategoryDto: CreateJobCategoryDto) {
    return 'This action adds a new jobCategory';
  }

  findAll() {
    return `This action returns all jobCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobCategory`;
  }

  update(id: number, updateJobCategoryDto: UpdateJobCategoryDto) {
    return `This action updates a #${id} jobCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobCategory`;
  }
}
