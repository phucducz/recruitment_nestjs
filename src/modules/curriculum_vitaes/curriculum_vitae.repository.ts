import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

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
      fileName: variable.fileName,
      user: variable.user,
      createAt: new Date().toString(),
      createBy,
    })) as CurriculumVitae;
  }

  async createMany(
    createCurriculumVitaeDto: ICreateMany<{ url: string; fileName: string }> & {
      user: User;
    },
  ) {
    const { createBy, variables, user } = createCurriculumVitaeDto;

    return await Promise.all(
      variables.map(
        async (variable) =>
          await this.create({
            createBy,
            variable: { url: variable.url, fileName: variable.fileName, user },
          }),
      ),
    );
  }

  async findByUserId(userId: number) {
    return await this.curriculumVitaeRepository.find({
      where: { user: { id: userId } },
      select: {
        ...this.CVSelectColumns,
      },
    });
  }

  async findById(id: number) {
    return await this.curriculumVitaeRepository.findOneBy({ id });
  }
}
