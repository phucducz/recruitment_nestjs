import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
