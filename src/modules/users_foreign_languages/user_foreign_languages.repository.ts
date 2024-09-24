import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';
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

  async findById(id: number) {
    return await this.usersForeignLanguageRepository.findOneBy({ id });
  }

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
      createAt: new Date().toString(),
      createBy,
    })) as UsersForeignLanguage;
  }

  async update(
    id: number,
    updateUsersForeignLanguageDto: IUpdate<UpdateUsersForeignLanguageDto>,
  ) {
    const { updateBy, variable } = updateUsersForeignLanguageDto;
    const currentForeignLanguage = await this.findById(id);
    const result = await this.usersForeignLanguageRepository.update(
      {
        id,
        foreignLanguagesId: currentForeignLanguage.foreignLanguagesId,
        usersId: currentForeignLanguage.usersId,
      },
      {
        level: variable.level,
        updateAt: new Date().toString(),
        updateBy,
      },
    );

    return result.affected > 0;
  }

  async remove(id: number) {
    const currentForeignLanguage = await this.findById(id);

    const result = await this.usersForeignLanguageRepository.delete({
      id,
      usersId: currentForeignLanguage.usersId,
      foreignLanguagesId: currentForeignLanguage.foreignLanguagesId,
    });

    console.log(result);
    console.log(new Date().toISOString(), currentForeignLanguage);

    return result.affected > 0;
  }
}
