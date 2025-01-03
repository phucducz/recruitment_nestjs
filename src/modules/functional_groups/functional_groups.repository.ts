import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import {
  filterColumns,
  getItemsDiff,
  getPaginationParams,
} from 'src/common/utils/function';
import { CreateFunctionalGroupDto } from 'src/dto/functional_groups/create-functional_group.dto';
import { UpdateFunctionalGroupDto } from 'src/dto/functional_groups/update-functional_group.dto';
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
        // ...filterColumns(ENTITIES.FIELDS.FUNCTIONAL_GROUP, removeColumns),
        functionals: filterColumns(ENTITIES.FIELDS.FUNCTIONAL, removeColumns),
      },
      order: { id: 'DESC' },
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

  async findById(id: number, options: FindOneOptions<FunctionalGroup>) {
    return await this.functionalGroupRepository.findOne({
      where: { id },
      ...options,
    });
  }

  async update(
    id: number,
    updateFunctionalGroupDto: IUpdate<
      UpdateFunctionalGroupDto & {
        functionals?: Functional[];
        storedFunctionals?: Functional[];
      }
    >,
  ) {
    const { updateBy, variable, transactionalEntityManager } =
      updateFunctionalGroupDto;

    const updateParams = {
      ...(variable.title && { title: variable.title }),
      ...(variable.description && { description: variable.description }),
      updateAt: new Date().toString(),
      updateBy,
    } as FunctionalGroup;

    const { itemsToAdd, itemsToRemove } = getItemsDiff({
      items: { data: variable.functionals, key: 'id' },
      storedItems: { data: variable.storedFunctionals, key: 'id' },
    });

    if (itemsToAdd.length > 0 || itemsToRemove.length > 0) {
      if (transactionalEntityManager)
        await transactionalEntityManager
          .createQueryBuilder()
          .relation(FunctionalGroup, 'functionals')
          .of(id)
          .addAndRemove(itemsToAdd, itemsToRemove);
      else
        await this.functionalGroupRepository
          .createQueryBuilder()
          .relation(FunctionalGroup, 'functionals')
          .of(id)
          .addAndRemove(itemsToAdd, itemsToRemove);
    }

    if (transactionalEntityManager)
      return (
        (
          await (transactionalEntityManager as EntityManager).update(
            FunctionalGroup,
            id,
            updateParams,
          )
        ).affected > 0
      );

    return this.functionalGroupRepository.update(id, updateParams);
  }

  async remove(id: number) {
    return await this.functionalGroupRepository.delete(id);
  }
}
