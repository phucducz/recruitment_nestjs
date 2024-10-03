import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getPaginationParams } from 'src/common/utils/function';
import { Skill } from 'src/entities/skill.entity';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class SkillsRepository {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async findById(id: number) {
    return await this.skillRepository.findOneBy({ id });
  }

  async findAll(skillQueries: ISkillQueries) {
    const { page, pageSize, title } = skillQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    console.log(paginationParams);
    console.log(skillQueries);

    return await this.skillRepository.findAndCount({
      where: {
        ...(title && {
          title: Raw((value: string) => `${value} ILIKE '%${title}%'`),
        }),
      },
      ...paginationParams,
      order: { title: 'ASC' },
    });
  }
}
