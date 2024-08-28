import { Module } from '@nestjs/common';
import { JobCategoriesService } from './job_categories.service';
import { JobCategoriesController } from './job_categories.controller';

@Module({
  controllers: [JobCategoriesController],
  providers: [JobCategoriesService],
})
export class JobCategoriesModule {}
