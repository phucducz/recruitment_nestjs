import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CVSelectColumns } from 'src/common/utils/constants';
import { CreateCurriculumVitaeDto } from 'src/dto/curriculum_vitae/create-curriculum-vitae.dto';
import { CurriculumVitae } from 'src/entities/curriculum_vitae';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CurriculumVitaesRepository {
  constructor(
    @InjectRepository(CurriculumVitae)
    private readonly curriculumVitaeRepository: Repository<CurriculumVitae>,
  ) {}

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
      select: CVSelectColumns,
    });
  }

  async findById(id: number) {
    return await this.curriculumVitaeRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return (await this.curriculumVitaeRepository.delete(id)).affected > 0;
  }
}
