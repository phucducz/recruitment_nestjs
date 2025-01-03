import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty } from 'class-validator';

import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsArray()
  @IsNotEmpty()
  functionalIds: number[];
}
