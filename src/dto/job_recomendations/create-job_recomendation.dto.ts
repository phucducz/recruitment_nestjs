import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobRecommendationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsNumberString()
  @IsNotEmpty()
  jobsId: number | string;

  @IsNumberString()
  @IsOptional()
  jobPositionsId?: number | string;
}
