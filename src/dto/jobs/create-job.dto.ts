import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  positionsId: number;

  @IsNumber()
  @IsNotEmpty()
  fieldsId: number;

  @IsNumber()
  @IsNotEmpty()
  workTypesId: number;

  @IsNumber()
  @IsNotEmpty()
  categoriesId: number;

  @IsArray()
  @IsNotEmpty()
  placementIds: number[];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  salaryMin: number;

  @IsNumber()
  @IsOptional()
  salaryMax: number;

  @IsString()
  @IsOptional()
  salaryCurrency?: TSalaryCurrency;

  @IsNumber()
  @IsOptional()
  minExpYearRequired: number;

  @IsNumber()
  @IsOptional()
  maxExpYearRequired: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  requirements: string;

  @IsString()
  @IsNotEmpty()
  benefits: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;
}
