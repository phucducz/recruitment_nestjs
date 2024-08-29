import { PartialType } from '@nestjs/mapped-types';
import { CreateJobCategoryDto } from './create-job_category.dto';

export class UpdateJobCategoryDto extends PartialType(CreateJobCategoryDto) {}
