import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsNumber()
  @IsNotEmpty()
  usersId: number;

  @IsNumber()
  @IsNotEmpty()
  jobsId: number;
}
