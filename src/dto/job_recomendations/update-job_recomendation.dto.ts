import { PartialType } from '@nestjs/swagger';
import { CreateJobRecomendationDto } from './create-job_recomendation.dto';

export class UpdateJobRecomendationDto extends PartialType(CreateJobRecomendationDto) {}
