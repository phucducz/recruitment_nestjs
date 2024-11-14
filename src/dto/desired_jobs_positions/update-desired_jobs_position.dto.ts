import { PartialType } from '@nestjs/swagger';
import { CreateDesiredJobsPositionDto } from './create-desired_jobs_position.dto';

export class UpdateDesiredJobsPositionDto extends PartialType(CreateDesiredJobsPositionDto) {}
