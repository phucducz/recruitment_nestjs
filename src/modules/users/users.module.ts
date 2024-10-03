import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { UsersService } from '../../services/users.service';
import { AuthModule } from '../auth/auth.module';
import { JobFieldsModule } from '../job_fields/job_fields.module';
import { JobPositionsModule } from '../job_positions/job_positions.module';
import { MailModule } from '../mail/mail.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { ResetPasswordModule } from '../reset_password/reset_password.module';
import { RolesModule } from '../roles/roles.module';
import { UsersJobFieldsModule } from '../users_job_fields/users_job_fields.module';
import { UsersController } from './users.controller';
import { UsersConverter } from './users.converter';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UsersJobField]),
    forwardRef(() => JobPositionsModule),
    RolesModule,
    JobFieldsModule,
    UsersJobFieldsModule,
    MailModule,
    ResetPasswordModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersConverter],
  exports: [UsersService],
})
export class UsersModule {}
