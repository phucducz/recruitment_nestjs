import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Schedule } from 'src/entities/schedule.entity';
import { SchedulesService } from '../../services/schedules.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersJobsModule } from '../users_jobs/users_jobs.module';
import { ScheduleRepository } from './schedule.repository';
import { SchedulesController } from './schedules.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    UsersJobsModule,
    RefreshTokenModule,
    AuthModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService, ScheduleRepository],
  exports: [SchedulesService, ScheduleRepository],
})
export class SchedulesModule {}
