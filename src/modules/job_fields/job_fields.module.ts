import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobField } from 'src/entities/job_field.entity';
import { JobFieldsService } from '../../services/job_fields.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { JobFieldsController } from './job_fields.controller';
import { JobFieldsRepository } from './job_fields.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobField]),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [JobFieldsController],
  providers: [JobFieldsService, JobFieldsRepository],
  exports: [JobFieldsService, JobFieldsRepository],
})
export class JobFieldsModule {}
