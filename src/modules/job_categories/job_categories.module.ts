import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobCategory } from 'src/entities/job_category.entity';
import { JobCategoriesService } from '../../services/job_categories.service';
import { JobCategoriesController } from './job_categories.controller';
import { JobCategoriesRepository } from './job_categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [JobCategoriesController],
  providers: [JobCategoriesService, JobCategoriesRepository],
  exports: [JobCategoriesService],
})
export class JobCategoriesModule {}
