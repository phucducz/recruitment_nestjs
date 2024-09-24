import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UsersForeignLanguage } from 'src/entities/users_foreign_language.entity';
import { ForeignLanguagesService } from 'src/services/foreign_languages.service';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class UsersForeignLanguagesRepository {
  constructor(
    @InjectRepository(UsersForeignLanguage)
    private readonly usersForeignLanguageRepository: Repository<UsersForeignLanguage>,
    @Inject(ForeignLanguagesService)
    private readonly foreignLanguagesService: ForeignLanguagesService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async create(
    createUsersForeignLanguageDto: ICreate<CreateUsersForeignLanguageDto>,
  ) {
    const { createBy, variable } = createUsersForeignLanguageDto;
    const foreignLanguage = await this.foreignLanguagesService.findById(
      variable.foreignLanguagesId,
    );
    const user = await this.usersService.findById(createBy);

    return (await this.usersForeignLanguageRepository.save({
      foreignLanguage,
      foreignLanguagesId: foreignLanguage.id,
      level: variable.level,
      user,
      usersId: user.id,
    })) as UsersForeignLanguage;
  }
}
