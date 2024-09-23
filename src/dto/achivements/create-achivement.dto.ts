import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAchivementDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
