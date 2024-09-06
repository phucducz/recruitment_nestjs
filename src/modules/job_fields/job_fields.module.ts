import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobField } from 'src/entities/job_field.entity';
import { JobFieldsService } from '../../services/job_fields.service';
import { JobFieldsController } from './job_fields.controller';
import { JobFieldsRepository } from './job_fields.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobField])],
  controllers: [JobFieldsController],
  providers: [JobFieldsService, JobFieldsRepository],
  exports: [JobFieldsService],
})
export class JobFieldsModule {}
