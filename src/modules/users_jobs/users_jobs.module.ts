import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersJobConverter } from 'src/common/converters/users_jobs.converter';
import { UsersJob } from 'src/entities/users_job.entity';
import { UsersJobsService } from '../../services/users_jobs.service';
import { ApplicationStatusModule } from '../application_status/application_status.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CurriculumVitaesModule } from '../curriculum_vitaes/curriculum_vitaes.module';
import { JobRecomendationsModule } from '../job_recomendations/job_recomendations.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { UsersJobsController } from './users_jobs.controller';
import { UsersJobRepository } from './users_jobs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersJob]),
    RefreshTokenModule,
    AuthModule,
    CloudinaryModule,
    ApplicationStatusModule,
    RolesModule,
    UsersModule,
    JobRecomendationsModule,
    forwardRef(() => CurriculumVitaesModule),
  ],
  controllers: [UsersJobsController],
  providers: [UsersJobsService, UsersJobRepository, UsersJobConverter],
  exports: [UsersJobsService],
})
export class UsersJobsModule {}
