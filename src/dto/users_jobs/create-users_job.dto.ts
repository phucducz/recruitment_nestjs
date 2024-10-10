import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUsersJobDto {
  @IsNotEmpty()
  @IsNumber()
  jobsId: number;

  @IsNotEmpty()
  @IsString()
  curriculumVitaeURL: string;
}
