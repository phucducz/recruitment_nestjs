import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DesiredJobsPosition } from 'src/entities/desired_jobs_position.entity';
import { DesiredJobsPositionsService } from 'src/services/desired_jobs_positions.service';
import { DesiredJobsPositionRepository } from './desired_jobs_position.repository';
import { DesiredJobsPositionsController } from './desired_jobs_positions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DesiredJobsPosition])],
  controllers: [DesiredJobsPositionsController],
  providers: [DesiredJobsPositionsService, DesiredJobsPositionRepository],
  exports: [DesiredJobsPositionsService, DesiredJobsPositionRepository],
})
export class DesiredJobsPositionsModule {}
