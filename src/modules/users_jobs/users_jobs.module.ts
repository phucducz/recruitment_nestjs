import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersJob } from 'src/entities/users_job.entity';
import { UsersJobsService } from '../../services/users_jobs.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CurriculumVitaesModule } from '../curriculum_vitaes/curriculum_vitaes.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersJobsController } from './users_jobs.controller';
import { UsersJobRepository } from './users_jobs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersJob]),
    RefreshTokenModule,
    AuthModule,
    CloudinaryModule,
    CurriculumVitaesModule,
  ],
  controllers: [UsersJobsController],
  providers: [UsersJobsService, UsersJobRepository],
  exports: [UsersJobsService],
})
export class UsersJobsModule {}
