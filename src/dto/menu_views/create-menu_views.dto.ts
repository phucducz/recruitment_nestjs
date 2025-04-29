import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuViewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  iconType: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsArray()
  @IsNotEmpty()
  functionalIds: number[];
}
