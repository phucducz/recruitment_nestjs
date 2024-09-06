import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { UsersJobFieldsService } from '../../services/users_job_fields.service';
import { UsersJobFieldRepository } from './user_job_fields.repository';
import { UsersJobFieldsController } from './users_job_fields.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsersJobField])],
  controllers: [UsersJobFieldsController],
  providers: [UsersJobFieldsService, UsersJobFieldRepository],
  exports: [UsersJobFieldsService],
})
export class UsersJobFieldsModule {}
