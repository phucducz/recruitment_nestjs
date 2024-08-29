import { Injectable } from '@nestjs/common';

import { CreateUsersSkillDto } from 'src/dto/users_skills/create-users_skill.dto';
import { UpdateUsersSkillDto } from 'src/dto/users_skills/update-users_skill.dto';

@Injectable()
export class UsersSkillsService {
  create(createUsersSkillDto: CreateUsersSkillDto) {
    return 'This action adds a new usersSkill';
  }

  findAll() {
    return `This action returns all usersSkills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersSkill`;
  }

  update(id: number, updateUsersSkillDto: UpdateUsersSkillDto) {
    return `This action updates a #${id} usersSkill`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersSkill`;
  }
}
