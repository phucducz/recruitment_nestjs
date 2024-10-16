import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChangePasswordDto } from './change-password.dto';

export class UpdateAccountInfoDto extends PartialType(ChangePasswordDto) {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsBoolean()
  isChangePassword: boolean;
}
