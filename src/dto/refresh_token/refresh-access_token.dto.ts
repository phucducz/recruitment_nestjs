import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
