import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
