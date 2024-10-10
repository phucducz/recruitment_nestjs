import { Inject, Injectable } from '@nestjs/common';
import { CreateCurriculumVitaeDto } from 'src/dto/curriculum_vitae/create-curriculum-vitae.dto';

import { CurriculumVitaesRepository } from 'src/modules/curriculum_vitaes/curriculum_vitae.repository';
import { UsersService } from './users.service';

@Injectable()
export class CurriculumVitaesService {
  constructor(
    @Inject(CurriculumVitaesRepository)
    private readonly curriculumVitaesRepository: CurriculumVitaesRepository,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async create(createCurriculumVitaeDto: ICreate<CreateCurriculumVitaeDto>) {
    const { createBy, variable } = createCurriculumVitaeDto;

    return await this.curriculumVitaesRepository.create({
      ...createCurriculumVitaeDto,
      variable: {
        ...variable,
        user: await this.usersService.findById(createBy),
      },
    });
  }

  async createMany(createManyCurriculumVitaeDto: ICreateMany<string>) {
    const { createBy, variables } = createManyCurriculumVitaeDto;

    return await this.curriculumVitaesRepository.createMany({
      createBy,
      variables,
      user: await this.usersService.findById(createBy),
    });
  }

  async findByUserId(userId: number) {
    return await this.curriculumVitaesRepository.findByUserId(userId);
  }
}
