import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdatUserByAdminDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
