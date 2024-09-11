import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobPositionDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
