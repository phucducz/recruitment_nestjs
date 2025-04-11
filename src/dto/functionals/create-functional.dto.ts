import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFunctionalDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
