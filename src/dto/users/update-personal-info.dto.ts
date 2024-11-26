import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsNumberString()
  @IsOptional()
  jobPositionsId?: number | string;

  @IsNumberString()
  @IsOptional()
  totalYearExperience: number | string;

  @IsNumberString()
  @IsOptional()
  placementsId?: number | string;

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
