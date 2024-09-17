import { Inject, Injectable } from '@nestjs/common';

import { CreateJobCategoryDto } from 'src/dto/job_categories/create-job_category.dto';
import { JobCategoriesRepository } from 'src/modules/job_categories/job_categories.repository';

@Injectable()
export class JobCategoriesService {
  constructor(
    @Inject(JobCategoriesRepository)
    private readonly jobCategoryRepository: JobCategoriesRepository,
  ) {}

  async findAll(pagination: IPagination) {
    return await this.jobCategoryRepository.findAll(pagination);
  }

  async findById(id: number) {
    return await this.jobCategoryRepository.findById(id);
  }

  async create(createJobCategory: ICreate<CreateJobCategoryDto>) {
    return await this.jobCategoryRepository.create(createJobCategory);
  }

  async createMany(createJobCategories: ICreateMany<CreateJobCategoryDto>) {
    return await this.jobCategoryRepository.createMany(createJobCategories);
  }
}
