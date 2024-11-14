import { PartialType } from '@nestjs/swagger';
import { CreateDesiredJobDto } from './create-desired_job.dto';

export class UpdateDesiredJobDto extends PartialType(CreateDesiredJobDto) {}
