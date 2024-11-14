import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ChangePasswordDto } from './change-password.dto';

export class UpdateAccountInfoDto extends PartialType(ChangePasswordDto) {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsBoolean()
  isChangePassword?: boolean;
}
