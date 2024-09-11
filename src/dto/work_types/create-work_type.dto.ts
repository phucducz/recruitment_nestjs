import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkTypeDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
