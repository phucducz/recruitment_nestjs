import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DesiredJobsPosition } from 'src/entities/desired_jobs_position.entity';
import { DesiredJobsPositionsService } from 'src/services/desired_jobs_positions.service';
import { DesiredJobsPositionsController } from './desired_jobs_positions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DesiredJobsPosition])],
  controllers: [DesiredJobsPositionsController],
  providers: [DesiredJobsPositionsService],
  exports: [DesiredJobsPositionsService],
})
export class DesiredJobsPositionsModule {}
