import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationStatus } from 'src/entities/application_status.entity';
import { ApplicationStatusService } from '../../services/application_status.service';
import { ApplicationStatusController } from './application_status.controller';
import { ApplicationStatusRepository } from './application_status.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationStatus])],
  controllers: [ApplicationStatusController],
  providers: [ApplicationStatusService, ApplicationStatusRepository],
  exports: [ApplicationStatusService, ApplicationStatusRepository],
})
export class ApplicationStatusModule {}
