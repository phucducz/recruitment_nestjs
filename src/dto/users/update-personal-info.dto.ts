import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsNumber()
  @IsOptional()
  jobPositionsId?: number;

  @IsNumber()
  @IsOptional()
  totalYearExperience: number;

  @IsNumber()
  @IsOptional()
  placementsId?: number;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  companyUrl?: string;
}
