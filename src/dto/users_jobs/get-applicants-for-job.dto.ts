import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetApplicantsForJobDto {
  @IsString()
  @IsNotEmpty()
  usersId: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;
  
  @IsString()
  @IsOptional()
  applicantName?: string;
  
  @IsString()
  @IsOptional()
  source?: string;
  
  @IsString()
  @IsOptional()
  applyDate?: string;
  
}
