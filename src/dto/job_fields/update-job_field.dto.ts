import { PartialType } from '@nestjs/mapped-types';
import { CreateJobFieldDto } from './create-job_field.dto';

export class UpdateJobFieldDto extends PartialType(CreateJobFieldDto) {}
