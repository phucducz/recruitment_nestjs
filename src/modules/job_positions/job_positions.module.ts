import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobPosition } from 'src/entities/job_position.entity';
import { JobPositionsService } from '../../services/job_positions.service';
import { JobPositionsController } from './job_positions.controller';
import { JobPositionsRepository } from './job_positions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosition])],
  controllers: [JobPositionsController],
  providers: [JobPositionsService, JobPositionsRepository],
  exports: [JobPositionsService],
})
export class JobPositionsModule {}
