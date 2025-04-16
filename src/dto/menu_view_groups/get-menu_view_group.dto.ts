import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class FunctionalDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class MenuViewDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  iconType: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;

  @IsArray()
  @IsNotEmpty()
  functionals: FunctionalDto[];

  @IsNumber()
  @IsOptional()
  menuViewGroupId: number | null;
}

export class MenuViewGroupDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;

  @IsArray()
  @IsNotEmpty()
  menuViews: MenuViewDto[];
}

export class ViewGroupsResponseDto {
  @IsArray()
  @IsNotEmpty()
  viewGroups: MenuViewGroupDto[];

  @IsArray()
  @IsNotEmpty()
  standaloneViews: MenuViewDto[];
}
