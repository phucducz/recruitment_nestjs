import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsSelect, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/create-users_foreign_language.dto';
import { UpdateUsersForeignLanguageDto } from 'src/dto/users_foreign_languages/update-users_foreign_language.dto';
import { UsersForeignLanguage } from 'src/entities/users_foreign_language.entity';

@Injectable()
export class UsersForeignLanguagesRepository {
  constructor(
    @InjectRepository(UsersForeignLanguage)
    private readonly usersForeignLanguageRepository: Repository<UsersForeignLanguage>,
  ) {}

  async findByCompositePrKey(params: {
    usersId: number;
    foreignLanguagesId: number;
  }) {
    return await this.usersForeignLanguageRepository.findOneBy(params);
  }

  async create(
    createUsersForeignLanguageDto: ICreate<
      CreateUsersForeignLanguageDto &
        Pick<UsersForeignLanguage, 'user' | 'foreignLanguage'>
    >,
  ) {
    const { createBy, variable, transactionalEntityManager } =
      createUsersForeignLanguageDto;
    const createParams = {
      foreignLanguage: variable.foreignLanguage,
      level: variable.level,
      user: variable.user,
      createAt: new Date().toString(),
      createBy,
    } as UsersForeignLanguage;

    if (transactionalEntityManager)
      return await (transactionalEntityManager as EntityManager).save(
        createParams,
      );

    return await this.usersForeignLanguageRepository.save(createParams);
  }

  async createMany(
    createUsersForeignLanguageDto: ICreateMany<
      CreateUsersForeignLanguageDto &
        Pick<UsersForeignLanguage, 'user' | 'foreignLanguage'>
    >,
  ) {
    const { createBy, variables, transactionalEntityManager } =
      createUsersForeignLanguageDto;

    return await Promise.all(
      variables.map((variable) =>
        this.create({ createBy, variable, transactionalEntityManager }),
      ),
    );
  }

  async update(
    updateUsersForeignLanguageDto: IUpdateMTM<
      UpdateUsersForeignLanguageDto,
      { foreignLanguagesId: number; usersId: number }
    >,
  ) {
    const { updateBy, variable, queries, transactionalEntityManager } =
      updateUsersForeignLanguageDto;
    const updateParams = {
      level: variable.level,
      updateAt: new Date().toString(),
      updateBy,
    };

    if (transactionalEntityManager) {
      return (
        (
          await this.usersForeignLanguageRepository.update(
            queries,
            updateParams,
          )
        ).affected > 0
      );
    }

    return (
      (await this.usersForeignLanguageRepository.update(queries, updateParams))
        .affected > 0
    );
  }

  async updateMany(
    updateUsersForeignLanguageDto: IUpdateMTM<
      UpdateUsersForeignLanguageDto,
      { foreignLanguagesId: number; usersId: number }
    >[],
  ) {
    return await Promise.all(
      updateUsersForeignLanguageDto.map((dto) => this.update(dto)),
    );
  }

  async remove(params: { foreignLanguagesId: number; usersId: number }) {
    const result = await this.usersForeignLanguageRepository.delete(params);

    return result.affected > 0;
  }

  async removeMany(params: { foreignLanguagesId: number; usersId: number }[]) {
    return await Promise.all(params.map((param) => this.remove(param)));
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
