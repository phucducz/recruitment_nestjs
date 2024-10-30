import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DesiredJob } from 'src/entities/desired_job.entity';
import { DesiredJobsService } from '../../services/desired_jobs.service';
import { DesiredJobsController } from './desired_jobs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DesiredJob])],
  controllers: [DesiredJobsController],
  providers: [DesiredJobsService],
  exports: [DesiredJobsService],
})
export class DesiredJobsModule {}
