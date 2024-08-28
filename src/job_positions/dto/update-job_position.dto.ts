import { PartialType } from '@nestjs/mapped-types';
import { CreateJobPositionDto } from './create-job_position.dto';

export class UpdateJobPositionDto extends PartialType(CreateJobPositionDto) {}
