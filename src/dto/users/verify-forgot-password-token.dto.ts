import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetPasswordTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsString()
  email: string;
}
