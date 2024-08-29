import { Injectable } from '@nestjs/common';

import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';

@Injectable()
export class UsersForeignLanguagesService {
  create(createUsersForeignLanguageDto: CreateUsersForeignLanguageDto) {
    return 'This action adds a new usersForeignLanguage';
  }

  findAll() {
    return `This action returns all usersForeignLanguages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersForeignLanguage`;
  }

  update(id: number, updateUsersForeignLanguageDto: UpdateUsersForeignLanguageDto) {
    return `This action updates a #${id} usersForeignLanguage`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersForeignLanguage`;
  }
}
