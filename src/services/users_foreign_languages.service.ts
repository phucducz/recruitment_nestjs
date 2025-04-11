import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';
import { UsersForeignLanguagesRepository } from 'src/modules/users_foreign_languages/user_foreign_languages.repository';
import { ForeignLanguagesService } from './foreign_languages.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersForeignLanguagesService {
  constructor(
    @Inject(UsersForeignLanguagesRepository)
    private readonly usersForeignLanguagesRepository: UsersForeignLanguagesRepository,
    @Inject(ForeignLanguagesService)
    private readonly foreignLanguagesService: ForeignLanguagesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(
    createUsersForeignLanguageDto: ICreate<CreateUsersForeignLanguageDto>,
  ) {
    const { createBy, variable } = createUsersForeignLanguageDto;

    return await this.usersForeignLanguagesRepository.create({
      ...createUsersForeignLanguageDto,
      variable: {
        ...createUsersForeignLanguageDto.variable,
        foreignLanguage: await this.foreignLanguagesService.findById(
          variable.foreignLanguagesId,
        ),
        user: await this.usersService.findById(createBy, {
          hasRelations: false,
        }),
      },
    });
  }

  async findAll(userForeignLanguageQueries: IFindUserForeignLanguagesQueries) {
    return await this.usersForeignLanguagesRepository.findBy(
      userForeignLanguageQueries,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} usersForeignLanguage`;
  }

  async update(
    updateUsersForeignLanguageDto: IUpdateMTM<
      UpdateUsersForeignLanguageDto,
      { foreignLanguagesId: number; usersId: number }
    >,
  ) {
    return await this.usersForeignLanguagesRepository.update(
      updateUsersForeignLanguageDto,
    );
  }

  async remove(params: { foreignLanguagesId: number; usersId: number }) {
    return await this.usersForeignLanguagesRepository.remove(params);
  }
}
