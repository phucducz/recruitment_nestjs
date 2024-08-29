import { Module } from '@nestjs/common';
import { JobFieldsService } from '../../services/job_fields.service';
import { JobFieldsController } from './job_fields.controller';

@Module({
  controllers: [JobFieldsController],
  providers: [JobFieldsService],
})
export class JobFieldsModule {}
