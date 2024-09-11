import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobFieldDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
