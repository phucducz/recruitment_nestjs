import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationStatus } from 'src/entities/application_status.entity';
import { ApplicationStatusService } from '../../services/application_status.service';
import { ApplicationStatusController } from './application_status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationStatus])],
  controllers: [ApplicationStatusController],
  providers: [ApplicationStatusService],
  exports: [ApplicationStatusService],
})
export class ApplicationStatusModule {}
