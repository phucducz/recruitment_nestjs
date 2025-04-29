import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuViewGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  menuViewIds: number[];
}
