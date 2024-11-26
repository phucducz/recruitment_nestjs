import { PartialType } from '@nestjs/swagger';
import { CreateRolesFunctionalDto } from './create-roles_functional.dto';

export class UpdateRolesFunctionalDto extends PartialType(CreateRolesFunctionalDto) {}
