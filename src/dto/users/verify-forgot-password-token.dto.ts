import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyForgotPasswordTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
