import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { UsersService } from '../../services/users.service';
import { JobFieldsModule } from '../job_fields/job_fields.module';
import { JobPositionsModule } from '../job_positions/job_positions.module';
import { RolesModule } from '../roles/roles.module';
import { UsersJobFieldRepository } from '../users_job_fields/user_job_fields.repository';
import { UsersJobFieldsModule } from '../users_job_fields/users_job_fields.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JobPositionsModule,
    RolesModule,
    JobFieldsModule,
    UsersJobFieldsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersJobFieldRepository],
  exports: [UsersService],
})
export class UsersModule {}
