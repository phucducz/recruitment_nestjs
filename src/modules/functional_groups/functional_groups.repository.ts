import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateFunctionalGroupDto } from 'src/dto/functional_groups/create-functional_group.dto';
import { Functional } from 'src/entities/functional.entity';
import { FunctionalGroup } from 'src/entities/functional_group.entity';

@Injectable()
export class FunctionalGroupRepository {
  constructor(
    @InjectRepository(FunctionalGroup)
    private readonly functionalGroupRepository: Repository<FunctionalGroup>,
  ) {}

  async findAll(functionalGroupQueries: FunctionalGroupQueries) {
    const { page, pageSize } = functionalGroupQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.functionalGroupRepository.findAndCount({
      ...paginationParams,
      relations: ['functionals'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.FUNCTIONAL_GROUP, removeColumns),
        functionals: filterColumns(ENTITIES.FIELDS.FUNCTIONAL, removeColumns),
      },
    });
  }

  async create(
    createFunctionalGroupDto: ICreate<
      CreateFunctionalGroupDto & { functionals: Functional[] }
    >,
  ): Promise<FunctionalGroup> {
    const { createBy, variable, transactionalEntityManager } =
      createFunctionalGroupDto;
    const createParams = {
      description: variable.description,
      title: variable.title,
      functionals: variable.functionals,
      createBy,
      createAt: new Date().toString(),
    } as FunctionalGroup;

    if (transactionalEntityManager)
      return await transactionalEntityManager.save(
        FunctionalGroup,
        createParams,
      );

    return await this.functionalGroupRepository.save(createParams);
  }
}
