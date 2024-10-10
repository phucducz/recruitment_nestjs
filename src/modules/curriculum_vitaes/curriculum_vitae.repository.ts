import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsSelect, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns } from 'src/common/utils/function';
import { CreateCurriculumVitaeDto } from 'src/dto/curriculum_vitae/create-curriculum-vitae.dto';
import { CurriculumVitae } from 'src/entities/curriculum_vitae';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CurriculumVitaesRepository {
  constructor(
    @InjectRepository(CurriculumVitae)
    private readonly curriculumVitaeRepository: Repository<CurriculumVitae>,
  ) {}

  private readonly CVSelectColumns = filterColumns(
    ENTITIES.FIELDS.CURRICULUM_VITAE,
    removeColumns,
  ) as FindOptionsSelect<CurriculumVitae>;

  async create(
    createCurriculumVitaeDto: ICreate<
      CreateCurriculumVitaeDto & {
        user: User;
      }
    >,
  ) {
    const { createBy, variable } = createCurriculumVitaeDto;

    return (await this.curriculumVitaeRepository.save({
      url: variable.url,
      user: variable.user,
      createAt: new Date().toString(),
      createBy,
    })) as CurriculumVitae;
  }

  async findByUserId(userId: number) {
    return await this.curriculumVitaeRepository.find({
      where: { user: { id: userId } },
      select: {
        ...this.CVSelectColumns,
      },
    });
  }
}
