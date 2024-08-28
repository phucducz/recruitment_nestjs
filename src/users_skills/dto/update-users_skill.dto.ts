import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersSkillDto } from './create-users_skill.dto';

export class UpdateUsersSkillDto extends PartialType(CreateUsersSkillDto) {}
