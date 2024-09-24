import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsersSkillDto } from 'src/dto/users_skills/create-users_skill.dto';
import { UpdateUsersSkillDto } from 'src/dto/users_skills/update-users_skill.dto';
import { UsersSkill } from 'src/entities/users_skill.entity';
import { SkillsService } from 'src/services/skills.service';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class UsersSkillsRepository {
  constructor(
    @InjectRepository(UsersSkill)
    private readonly usersSkillRepository: Repository<UsersSkill>,
    @Inject(UsersService) private readonly userSerivce: UsersService,
    @Inject(SkillsService) private readonly skillsService: SkillsService,
  ) {}

  async findByCompositePrKey(params: { skillsId: number; usersId: number }) {
    return await this.usersSkillRepository.findOneBy(params);
  }

  async create(createUsersSkillDto: ICreate<CreateUsersSkillDto>) {
    const { createBy, variable } = createUsersSkillDto;

    const user = await this.userSerivce.findById(createBy);
    const skill = await this.skillsService.findById(variable.skillsId);

    return (await this.usersSkillRepository.save({
      createAt: new Date().toString(),
      createBy,
      level: variable.level,
      user,
      users_id: user.id,
      skill,
      skills_id: skill.id,
    })) as UsersSkill;
  }

  async update(updateUsersSkillDto: IUpdate<UpdateUsersSkillDto>) {
    const { updateBy, variable } = updateUsersSkillDto;
    
    const usersSkill = await this.findByCompositePrKey({
      skillsId: variable.skillsId,
      usersId: updateBy,
    });
    const result = await this.usersSkillRepository.update(
      { usersId: usersSkill.usersId, skillsId: usersSkill.skillsId },
      { level: variable.level },
    );

    return result.affected > 0;
  }
}
