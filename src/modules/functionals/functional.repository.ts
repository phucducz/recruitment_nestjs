import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, In, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { Functional } from 'src/entities/functional.entity';

@Injectable()
export class FunctionalRepository {
  constructor(
    @InjectRepository(Functional)
    private readonly functionalRepository: Repository<Functional>,
  ) {}

  async findByIds(ids: number[]) {
    return await this.functionalRepository.findBy({ id: In(ids) });
  }

  async findAll(functionalQueries: FunctionalQueries) {
    const { page, pageSize } = functionalQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.functionalRepository.findAndCount({
      ...paginationParams,
      select: {
        ...filterColumns(ENTITIES.FIELDS.FUNCTIONAL, removeColumns),
      } as FindOptionsSelect<Functional>,
    });
  }
}
