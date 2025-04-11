import { Injectable } from '@nestjs/common';
import { FindOptionsSelect, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { Status } from 'src/entities/status.entity';

@Injectable()
export class StatusRepository {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async findByTitle(title: string, statusTypesId: number) {
    return await this.statusRepository.findOneBy({
      title,
      statusType: { id: statusTypesId },
    });
  }

  async findById(id: number) {
    return await this.statusRepository.findOneBy({ id });
  }

  async findByCode(code: string) {
    return await this.statusRepository.findOneBy({ code });
  }

  async findByType(title: string) {
    return await this.statusRepository.findBy({ statusType: { title } });
  }

  async findAll(findStatusQueries: IFindStatusQueries) {
    const { type } = findStatusQueries;
    const paginationParams = getPaginationParams({
      page: +findStatusQueries.page,
      pageSize: +findStatusQueries.pageSize,
    });

    return await this.statusRepository.findAndCount({
      where: { statusType: { code: type } },
      relations: ['statusType'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.STATUS, removeColumns),
        statusType: filterColumns(ENTITIES.FIELDS.STATUS_TYPE, removeColumns),
      } as FindOptionsSelect<Status>,
      ...paginationParams,
    });
  }
}
