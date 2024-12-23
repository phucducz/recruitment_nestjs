import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateJobCategoryDto } from 'src/dto/job_categories/create-job_category.dto';
import { JobCategory } from 'src/entities/job_category.entity';
import { getPaginationParams } from 'src/common/utils/function';

@Injectable()
export class JobCategoriesRepository {
  constructor(
    @InjectRepository(JobCategory)
    private readonly jobCategoryRepository: Repository<JobCategory>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async findAll(pagination: IPagination) {
    const paginationParams = getPaginationParams(pagination);

    return await this.jobCategoryRepository.findAndCount(paginationParams);
  }

  async findById(id: number) {
    return await this.jobCategoryRepository.findOne({ where: { id: id } });
  }

  async create(
    createJobCategory: ICreate<CreateJobCategoryDto>,
  ): Promise<JobCategory | null> {
    const { createBy, variable } = createJobCategory;

    return (await this.jobCategoryRepository.save({
      name: variable.name,
      createAt: new Date().toString(),
      description: variable.description,
      createBy: createBy,
    })) as JobCategory;
  }

  async createMany(createJobCategories: ICreateMany<CreateJobCategoryDto>) {
    const { createBy, variables } = createJobCategories;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) =>
        await Promise.all(
          variables.map(
            async (jobCategory) =>
              (await transactionalEntityManager.save(JobCategory, {
                createAt: new Date().toString(),
                createBy: createBy,
                description: jobCategory.description,
                name: jobCategory.name,
              })) as JobCategory,
          ),
        ),
    );
  }
}
