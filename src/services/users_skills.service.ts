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

  async findAll(userSkillQueries: IFindUserSkillsQueries) {
    return await this.usersSkillRepository.findBy(userSkillQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} usersSkill`;
  }

  async update(
    updateUsersSkillDto: IUpdateMTM<
      UpdateUsersSkillDto,
      { skillsId: number; usersId: number }
    >,
  ) {
    return await this.usersSkillRepository.update(updateUsersSkillDto);
  }

  async remove(params: { skillsId: number; usersId: number }) {
    return await this.usersSkillRepository.remove(params);
  }
}
