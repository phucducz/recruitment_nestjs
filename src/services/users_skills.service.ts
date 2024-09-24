import { Inject, Injectable } from '@nestjs/common';

import { CreateUsersSkillDto } from 'src/dto/users_skills/create-users_skill.dto';
import { UpdateUsersSkillDto } from 'src/dto/users_skills/update-users_skill.dto';
import { UsersSkillsRepository } from 'src/modules/users_skills/users_skills.repository';

@Injectable()
export class UsersSkillsService {
  constructor(
    @Inject(UsersSkillsRepository)
    private readonly usersSkillRepository: UsersSkillsRepository,
  ) {}

  async create(createUsersSkillDto: ICreate<CreateUsersSkillDto>) {
    return await this.usersSkillRepository.create(createUsersSkillDto);
  }

  findAll() {
    return `This action returns all usersSkills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersSkill`;
  }

  async update(updateUsersSkillDto: IUpdate<UpdateUsersSkillDto>) {
    return await this.usersSkillRepository.update(updateUsersSkillDto);
  }

  remove(id: number) {
    return `This action removes a #${id} usersSkill`;
  }
}
