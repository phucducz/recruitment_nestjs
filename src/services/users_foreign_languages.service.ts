import { Inject, Injectable } from '@nestjs/common';

import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';
import { UsersForeignLanguagesRepository } from 'src/modules/users_foreign_languages/user_foreign_languages.repository';

@Injectable()
export class UsersForeignLanguagesService {
  constructor(
    @Inject(UsersForeignLanguagesRepository)
    private readonly usersForeignLanguagesRepository: UsersForeignLanguagesRepository,
  ) {}

  async create(
    createUsersForeignLanguageDto: ICreate<CreateUsersForeignLanguageDto>,
  ) {
    return await this.usersForeignLanguagesRepository.create(
      createUsersForeignLanguageDto,
    );
  }

  findAll() {
    return `This action returns all usersForeignLanguages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersForeignLanguage`;
  }

  async update(
    id: number,
    updateUsersForeignLanguageDto: IUpdate<UpdateUsersForeignLanguageDto>,
  ) {
    return await this.usersForeignLanguagesRepository.update(
      id,
      updateUsersForeignLanguageDto,
    );
  }

  async remove(id: number) {
    return await this.usersForeignLanguagesRepository.remove(id);
  }
}
