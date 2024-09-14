import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlacementDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
