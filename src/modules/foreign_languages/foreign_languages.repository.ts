import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

import { getPaginationParams } from 'src/common/utils/function';
import { ForeignLanguage } from 'src/entities/foreign_language.entity';

@Injectable()
export class ForeignLanguagesRepository {
  constructor(
    @InjectRepository(ForeignLanguage)
    private readonly foreignLanguagesRepository: Repository<ForeignLanguage>,
  ) {}

  async findById(id: number) {
    return await this.foreignLanguagesRepository.findOneBy({ id });
  }

  async findAll(foreignLanguageQueries: IForeignLanguageQueries) {
    const { page, pageSize, title } = foreignLanguageQueries;

    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    return await this.foreignLanguagesRepository.findAndCount({
      where: {
        ...(title && {
          title: Raw((value: string) => `${value} ILIKE '%${title}%'`),
        }),
      },
      ...paginationParams,
    });
  }
}
