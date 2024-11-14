import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
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

  async findByCompositePrKey(params: {
    usersId: number;
    foreignLanguagesId: number;
  }) {
    return await this.usersForeignLanguageRepository.findOneBy(params);
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
    updateUsersForeignLanguageDto: IUpdateMTM<
      UpdateUsersForeignLanguageDto,
      { foreignLanguagesId: number; usersId: number }
    >,
  ) {
    const { updateBy, variable, queries } = updateUsersForeignLanguageDto;

    const result = await this.usersForeignLanguageRepository.update(queries, {
      level: variable.level,
      updateAt: new Date().toString(),
      updateBy,
    });

    return result.affected > 0;
  }

  async remove(params: { foreignLanguagesId: number; usersId: number }) {
    const result = await this.usersForeignLanguageRepository.delete(params);

    return result.affected > 0;
  }

  async findBy(userForeignLanguageQueries: IFindUserForeignLanguagesQueries) {
    const { foreignLanguagesId, page, pageSize, usersId } =
      userForeignLanguageQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    return await this.usersForeignLanguageRepository.findAndCount({
      where: {
        ...(foreignLanguagesId && { foreignLanguagesId: +foreignLanguagesId }),
        ...(usersId && { usersId: +usersId }),
      },
      relations: ['foreignLanguage'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.USERS_FOREIGN_LANGUAGE, removeColumns),
        foreignLanguage: filterColumns(
          ENTITIES.FIELDS.FOREIGN_LANGUAGE,
          removeColumns,
        ),
      } as FindOptionsSelect<UsersForeignLanguage>,
      ...paginationParams,
    });
  }
}
