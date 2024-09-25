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
  placements: number[];
  // placements: {
  //   id: number;
  //   amount: number;
  //   detailAddress: string;
  // }[];

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
  @IsNotEmpty()
  salaryCurrency: TSalaryCurrency;

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
  requirement: string;

  @IsString()
  @IsNotEmpty()
  benefit: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsNotEmpty()
  workTime: string;
}
