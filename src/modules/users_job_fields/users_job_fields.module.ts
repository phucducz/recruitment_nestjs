import { Module } from '@nestjs/common';
import { UsersJobFieldsService } from './users_job_fields.service';
import { UsersJobFieldsController } from './users_job_fields.controller';

@Module({
  controllers: [UsersJobFieldsController],
  providers: [UsersJobFieldsService],
})
export class UsersJobFieldsModule {}
