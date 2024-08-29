import { PartialType } from '@nestjs/mapped-types';
import { CreateJobsPlacementDto } from './create-jobs_placement.dto';

export class UpdateJobsPlacementDto extends PartialType(CreateJobsPlacementDto) {}
