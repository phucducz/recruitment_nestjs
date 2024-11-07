import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  companyUrl?: string;

  @IsArray()
  @IsOptional()
  jobFieldsIds?: number[];

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsNumber()
  @IsOptional()
  jobPositionsId?: number;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsString()
  // @IsNotEmpty()
  // type: 'user' | 'employer' | 'admin';

  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  avatarURL?: string;
}
