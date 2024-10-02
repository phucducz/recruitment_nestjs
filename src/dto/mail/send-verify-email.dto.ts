import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendSignUpVerificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  // @IsString()
  // @IsNotEmpty()
  // password: string;

  @IsNumber()
  @IsNotEmpty()
  rolesId: number;
}
