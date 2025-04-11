import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDesiredJobDto {
  @IsString()
  @IsOptional()
  startAfterOffer: string;

  @IsNumber()
  @IsNotEmpty()
  jobFieldsId: number;

  @IsNumber()
  @IsNotEmpty()
  totalYearExperience: number;

  @IsArray()
  @IsOptional()
  foreignLanguages: {
    id: number;
    level: number;
  }[];

  @IsString()
  @IsNotEmpty()
  yearOfBirth: string;

  @IsNumber()
  @IsOptional()
  salaryExpectation: number;

  @IsArray()
  @IsNotEmpty()
  jobPositionIds: number[];

  @IsArray()
  @IsNotEmpty()
  jobPlacementIds: number[];

  @IsString()
  @IsNotEmpty()
  achivements: string;
}
