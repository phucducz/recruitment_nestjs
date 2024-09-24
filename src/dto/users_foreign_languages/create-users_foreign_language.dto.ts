import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUsersForeignLanguageDto {
  @IsNumber()
  @IsNotEmpty()
  foreignLanguagesId: number;

  @IsNumber()
  @IsNotEmpty()
  level: number;
}
