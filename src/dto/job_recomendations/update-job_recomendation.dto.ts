import { PartialType } from '@nestjs/swagger';
import { CreateJobRecommendationDto } from './create-job_recomendation.dto';

export class UpdateJobRecommendationDto extends PartialType(
  CreateJobRecommendationDto,
) {}
