import { Inject, Injectable } from '@nestjs/common';

import { CreateForeignLanguageDto } from 'src/dto/foreign_languages/create-foreign_language.dto';
import { UpdateForeignLanguageDto } from 'src/dto/foreign_languages/update-foreign_language.dto';
import { ForeignLanguagesRepository } from 'src/modules/foreign_languages/foreign_languages.repository';

@Injectable()
export class ForeignLanguagesService {
  constructor(
    @Inject(ForeignLanguagesRepository)
    private readonly foreignLanguagesRepository: ForeignLanguagesRepository,
  ) {}

  create(createForeignLanguageDto: CreateForeignLanguageDto) {
    return 'This action adds a new foreignLanguage';
  }

  findAll() {
    return `This action returns all foreignLanguages`;
  }

  async findById(id: number) {
    return await this.foreignLanguagesRepository.findById(id);
  }

  update(id: number, updateForeignLanguageDto: UpdateForeignLanguageDto) {
    return `This action updates a #${id} foreignLanguage`;
  }

  remove(id: number) {
    return `This action removes a #${id} foreignLanguage`;
  }
}
