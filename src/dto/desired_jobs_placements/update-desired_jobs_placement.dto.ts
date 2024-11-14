import { PartialType } from '@nestjs/swagger';
import { CreateDesiredJobsPlacementDto } from './create-desired_jobs_placement.dto';

export class UpdateDesiredJobsPlacementDto extends PartialType(CreateDesiredJobsPlacementDto) {}
