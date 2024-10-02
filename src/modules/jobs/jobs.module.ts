import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/entities/job.entity';

import { JobConverter } from 'src/common/converters/job.converter';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { User } from 'src/entities/user.entity';
import { WorkType } from 'src/entities/work_type.entity';
import { JobsService } from '../../services/jobs.service';
import { AuthModule } from '../auth/auth.module';
import { JobCategoriesModule } from '../job_categories/job_categories.module';
import { JobFieldsModule } from '../job_fields/job_fields.module';
import { JobPositionsModule } from '../job_positions/job_positions.module';
import { JobsPlacementsModule } from '../jobs_placements/jobs_placements.module';
import { PlacementsModule } from '../placements/placements.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersModule } from '../users/users.module';
import { WorkTypesModule } from '../work_types/work_types.module';
import { JobsController } from './jobs.controller';
import { JobsRepository } from './jobs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      JobsPlacement,
      JobField,
      JobPosition,
      JobCategory,
      User,
      WorkType,
    ]),
    JobCategoriesModule,
    JobPositionsModule,
    JobFieldsModule,
    UsersModule,
    WorkTypesModule,
    PlacementsModule,
    JobsPlacementsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository, JobConverter],
  exports: [JobsService],
})
export class JobsModule {}
