import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LogOutDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
