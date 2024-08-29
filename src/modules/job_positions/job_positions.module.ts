import { Module } from '@nestjs/common';
import { JobPositionsService } from '../../services/job_positions.service';
import { JobPositionsController } from './job_positions.controller';

@Module({
  controllers: [JobPositionsController],
  providers: [JobPositionsService],
})
export class JobPositionsModule {}
