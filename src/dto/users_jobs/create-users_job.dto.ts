import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUsersJobDto {
  @IsOptional()
  @IsNumber()
  jobsId?: number;

  @IsOptional()
  @IsString()
  curriculumVitaeURL?: string;

  @IsOptional()
  cvFile?: Express.Multer.File;
}
