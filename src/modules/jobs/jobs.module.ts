import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/entities/job.entity';

import { JobsService } from '../../services/jobs.service';
import { JobsController } from './jobs.controller';
import { JobsRepository } from './jobs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository],
  exports: [JobsService],
})
export class JobsModule {}
