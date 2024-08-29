import { Module } from '@nestjs/common';
import { UsersJobsService } from '../../services/users_jobs.service';
import { UsersJobsController } from './users_jobs.controller';

@Module({
  controllers: [UsersJobsController],
  providers: [UsersJobsService],
})
export class UsersJobsModule {}
