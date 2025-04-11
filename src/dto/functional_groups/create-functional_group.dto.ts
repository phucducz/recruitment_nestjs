import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateFunctionalGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  functionalIds: number[];
}
