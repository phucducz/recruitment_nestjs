import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRolesFunctionalDto {
  @IsNumber()
  @IsNotEmpty()
  rolesId: number;

  @IsNumber()
  @IsNotEmpty()
  functionalsId: number;
}
