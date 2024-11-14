import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobRecomendation } from 'src/entities/job_recomendation.entity';
import { JobRecomendationsService } from 'src/services/job_recomendations.service';
import { JobRecomendationsController } from './job_recomendations.controller';
import { JobRecomendationRepository } from './job_recomendations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobRecomendation])],
  controllers: [JobRecomendationsController],
  providers: [JobRecomendationsService, JobRecomendationRepository],
  exports: [JobRecomendationsService, JobRecomendationRepository],
})
export class JobRecomendationsModule {}
