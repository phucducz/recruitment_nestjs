import { Injectable } from '@nestjs/common';

import { CreateForeignLanguageDto } from 'src/dto/foreign_languages/create-foreign_language.dto';
import { UpdateForeignLanguageDto } from 'src/dto/foreign_languages/update-foreign_language.dto';

@Injectable()
export class ForeignLanguagesService {
  create(createForeignLanguageDto: CreateForeignLanguageDto) {
    return 'This action adds a new foreignLanguage';
  }

  findAll() {
    return `This action returns all foreignLanguages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foreignLanguage`;
  }

  update(id: number, updateForeignLanguageDto: UpdateForeignLanguageDto) {
    return `This action updates a #${id} foreignLanguage`;
  }

  remove(id: number) {
    return `This action removes a #${id} foreignLanguage`;
  }
}
