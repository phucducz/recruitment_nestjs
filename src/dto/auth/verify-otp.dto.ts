import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyOTPDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
