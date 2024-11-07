import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @IsOptional()
  jobPositionsId?: number;

  @IsNumber()
  @IsNotEmpty()
  totalYearExperience: number;

  @IsNumber()
  @IsOptional()
  placementsId?: number;
}
