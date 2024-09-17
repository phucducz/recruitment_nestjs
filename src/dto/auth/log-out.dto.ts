import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LogOutDto {
  @IsNotEmpty()
  @IsNumber()
  usersId: number;

  @IsNotEmpty()
  @IsNumber()
  refreshTokensId: number;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
