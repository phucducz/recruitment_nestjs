import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateUsersJobDto {
  @IsNumber()
  @IsOptional()
  statusId?: number;

  @IsNumber()
  @IsNotEmpty()
  jobsId?: number;

  @IsNumber()
  @IsNotEmpty()
  usersId?: number;
}
