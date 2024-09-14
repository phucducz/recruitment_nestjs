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
  placements: {
    id: number;
    amount: number;
    detailAddress: string;
  }[];

  @IsNumber()
  @IsOptional()
  endPrice: number;

  @IsNumber()
  @IsOptional()
  startPrice: number;

  @IsNumber()
  @IsOptional()
  endExpYearRequired: number;

  @IsNumber()
  @IsOptional()
  startExpYearRequired: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  requirement: string;

  @IsString()
  @IsNotEmpty()
  whyLoveWorkingHere: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsNotEmpty()
  workTime: string;
}
