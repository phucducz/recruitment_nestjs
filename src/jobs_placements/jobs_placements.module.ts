import { Module } from '@nestjs/common';
import { JobsPlacementsService } from './jobs_placements.service';
import { JobsPlacementsController } from './jobs_placements.controller';

@Module({
  controllers: [JobsPlacementsController],
  providers: [JobsPlacementsService],
})
export class JobsPlacementsModule {}
