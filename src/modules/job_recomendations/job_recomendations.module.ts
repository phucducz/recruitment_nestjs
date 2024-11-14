import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationStatusModule } from '../application_status/application_status.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JobPositionsModule } from '../job_positions/job_positions.module';
import { JobsModule } from '../jobs/jobs.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { JobRecomendationsController } from './job_recomendations.controller';
import { JobRecommendation } from 'src/entities/job_recomendation.entity';
import { JobRecommendationsService } from 'src/services/job_recomendations.service';
import { JobRecommendationRepository } from './job_recomendations.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobRecommendation]),
    JobsModule,
    AuthModule,
    JobPositionsModule,
    CloudinaryModule,
    RefreshTokenModule,
    ApplicationStatusModule,
  ],
  controllers: [JobRecomendationsController],
  providers: [JobRecommendationsService, JobRecommendationRepository],
  exports: [JobRecommendationsService, JobRecommendationRepository],
})
export class JobRecomendationsModule {}
