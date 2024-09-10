import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  type: 'system' | 'google';

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  avatarURL?: string;
}
