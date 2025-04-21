import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkExperience } from 'src/entities/work_experience.entity';
import { WorkExperiencesService } from '../../services/work_experiences.service';
import { AuthModule } from '../auth/auth.module';
import { JobCategoriesModule } from '../job_categories/job_categories.module';
import { JobPositionsModule } from '../job_positions/job_positions.module';
import { PlacementsModule } from '../placements/placements.module';
import { RedisModule } from '../redis/redis.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersModule } from '../users/users.module';
import { WorkExperiencesController } from './work_experiences.controller';
import { WorkExperiencesRepository } from './work_experiences.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkExperience]),
    JobCategoriesModule,
    JobPositionsModule,
    PlacementsModule,
    UsersModule,
    RedisModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [WorkExperiencesController],
  providers: [WorkExperiencesService, WorkExperiencesRepository],
  exports: [WorkExperiencesService],
})
export class WorkExperiencesModule {}
