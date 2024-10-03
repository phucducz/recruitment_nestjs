import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifySignUpTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
