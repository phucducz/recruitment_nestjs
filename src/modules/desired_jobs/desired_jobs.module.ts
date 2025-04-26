import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DesiredJob } from 'src/entities/desired_job.entity';
import { JobField } from 'src/entities/job_field.entity';
import { DesiredJobsService } from '../../services/desired_jobs.service';
import { AchivementsModule } from '../achivements/achivements.module';
import { AuthModule } from '../auth/auth.module';
import { DesiredJobsPlacementsModule } from '../desired_jobs_placements/desired_jobs_placements.module';
import { DesiredJobsPositionsModule } from '../desired_jobs_positions/desired_jobs_positions.module';
import { ForeignLanguagesModule } from '../foreign_languages/foreign_languages.module';
import { JobFieldsModule } from '../job_fields/job_fields.module';
import { JobPositionsModule } from '../job_positions/job_positions.module';
import { PlacementsModule } from '../placements/placements.module';
import { RedisModule } from '../redis/redis.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { SkillsModule } from '../skills/skills.module';
import { UsersModule } from '../users/users.module';
import { UsersForeignLanguagesModule } from '../users_foreign_languages/users_foreign_languages.module';
import { UsersSkillsModule } from '../users_skills/users_skills.module';
import { DesiredJobsController } from './desired_jobs.controller';
import { DesiredJobsRepository } from './desired_jobs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DesiredJob, JobField]),
    RedisModule,
    JobFieldsModule,
    UsersSkillsModule,
    SkillsModule,
    DesiredJobsPlacementsModule,
    DesiredJobsPositionsModule,
    PlacementsModule,
    JobPositionsModule,
    JobFieldsModule,
    UsersSkillsModule,
    UsersForeignLanguagesModule,
    ForeignLanguagesModule,
    forwardRef(() => AchivementsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [DesiredJobsController],
  providers: [DesiredJobsService, DesiredJobsRepository],
  exports: [DesiredJobsService],
})
export class DesiredJobsModule {}
