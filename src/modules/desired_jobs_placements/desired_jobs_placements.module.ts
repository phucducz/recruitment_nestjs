import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DesiredJobsPlacement } from 'src/entities/desired_jobs_placement.entity';
import { DesiredJobsPlacementsService } from 'src/services/desired_jobs_placements.service';
import { DesiredJobsPlacementsController } from './desired_jobs_placements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DesiredJobsPlacement])],
  controllers: [DesiredJobsPlacementsController],
  providers: [DesiredJobsPlacementsService],
  exports: [DesiredJobsPlacementsService],
})
export class DesiredJobsPlacementsModule {}
