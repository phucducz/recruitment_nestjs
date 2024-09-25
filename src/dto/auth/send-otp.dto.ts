import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOTPDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
