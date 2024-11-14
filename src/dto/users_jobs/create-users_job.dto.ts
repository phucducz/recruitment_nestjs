import { IsNumberString, IsOptional } from 'class-validator';

export class CreateUsersJobDto {
  @IsOptional()
  @IsNumberString()
  jobsId?: number | string;

  @IsOptional()
  @IsNumberString()
  curriculumVitaesId?: number | string;

  @IsOptional()
  cvFile?: Express.Multer.File;
}
