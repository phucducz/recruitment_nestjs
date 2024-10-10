import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCurriculumVitaeDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}