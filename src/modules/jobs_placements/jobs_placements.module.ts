import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsPlacement } from 'src/entities/jobs_placement.entity';
import { JobsPlacementsService } from '../../services/jobs_placements.service';
import { JobsPlacementsController } from './jobs_placements.controller';
import { JobsPlacementsRepository } from './jobs_placements.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobsPlacement])],
  controllers: [JobsPlacementsController],
  providers: [JobsPlacementsService, JobsPlacementsRepository],
  exports: [JobsPlacementsService],
})
export class JobsPlacementsModule {}
