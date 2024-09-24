import { OmitType } from '@nestjs/mapped-types';
import { CreateUsersSkillDto } from './create-users_skill.dto';

export class UpdateUsersSkillDto extends OmitType(CreateUsersSkillDto, [
  'skillsId',
]) {}
