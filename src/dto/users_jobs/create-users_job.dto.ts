import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUsersJobDto {
  @IsOptional()
  @IsNumber()
  jobsId?: number;

  @IsOptional()
  @IsNumber()
  curriculumVitaesId?: number;

  @IsOptional()
  cvFile?: Express.Multer.File;
}
