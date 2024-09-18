import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobCategory } from 'src/entities/job_category.entity';
import { JobCategoriesService } from '../../services/job_categories.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { JobCategoriesController } from './job_categories.controller';
import { JobCategoriesRepository } from './job_categories.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobCategory]),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [JobCategoriesController],
  providers: [JobCategoriesService, JobCategoriesRepository],
  exports: [JobCategoriesService],
})
export class JobCategoriesModule {}
