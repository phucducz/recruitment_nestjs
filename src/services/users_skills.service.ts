import { Inject, Injectable } from '@nestjs/common';

import { CreateUsersSkillDto } from 'src/dto/users_skills/create-users_skill.dto';
import { UpdateUsersSkillDto } from 'src/dto/users_skills/update-users_skill.dto';
import { UsersSkillsRepository } from 'src/modules/users_skills/users_skills.repository';
import { SkillsService } from './skills.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersSkillsService {
  constructor(
    @Inject(UsersSkillsRepository)
    private readonly usersSkillRepository: UsersSkillsRepository,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(SkillsService) private readonly skillService: SkillsService,
  ) {}

  async create(createUsersSkillDto: ICreate<CreateUsersSkillDto>) {
    const { createBy, variable } = createUsersSkillDto;
    const user = await this.userService.findById(createBy);
    const skill = await this.skillService.findById(variable.skillsId);

    return await this.usersSkillRepository.create({
      ...createUsersSkillDto,
      variable: {
        ...variable,
        user,
        skill,
      },
    });
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
