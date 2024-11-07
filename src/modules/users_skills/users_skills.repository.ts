import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
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

  async findByUserId(usersId: number) {
    return await this.usersSkillRepository.findBy({ usersId });
  }

  async findBy(userSkillQueries: IFindUserSkillsQueries) {
    const { skillsId, page, pageSize, usersId } = userSkillQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    return await this.usersSkillRepository.findAndCount({
      where: {
        ...(usersId && { usersId: +usersId }),
        ...(skillsId && { skillsId: +skillsId }),
      },
      relations: ['skill'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.USER_SKILLS, removeColumns),
        skill: filterColumns(ENTITIES.FIELDS.SKILLS, removeColumns),
      } as FindOptionsSelect<UsersSkill>,
      ...paginationParams,
    });
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

  async update(
    updateUsersSkillDto: IUpdateMTM<
      UpdateUsersSkillDto,
      { skillsId: number; usersId: number }
    >,
  ) {
    const { updateBy, variable, queries } = updateUsersSkillDto;
    const result = await this.usersSkillRepository.update(
      { usersId: queries.usersId, skillsId: queries.skillsId },
      {
        level: variable.level,
        updateAt: new Date().toString(),
        updateBy: updateBy,
      },
    );

    return result.affected > 0;
  }

  async remove(params: { skillsId: number; usersId: number }) {
    const result = await this.usersSkillRepository.delete(params);

    return result.affected > 0;
  }

  async removeMany(params: { skillsId: number; usersId: number }[]) {
    await Promise.all(params.map((params) => this.remove(params)));
  }

  async createMany(createUsersSkillDto: ICreateMany<CreateUsersSkillDto>) {
    const { createBy, variables } = createUsersSkillDto;

    await Promise.all(
      variables.map((variable) =>
        this.create({ variable: variable, createBy: createBy }),
      ),
    );
  }

  async updateMany(updateUsersSkillDto: IUpdateMany<CreateUsersSkillDto>) {
    const { updateBy, variables } = updateUsersSkillDto;

    await Promise.all(
      variables.map((variable) =>
        this.update({
          queries: { skillsId: variable.skillsId, usersId: updateBy },
          updateBy,
          variable: { level: variable.level },
        }),
      ),
    );
  }
}
