import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOneOptions,
  FindOptionsSelect,
  In,
  Repository,
} from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateFunctionalDto } from 'src/dto/functionals/create-functional.dto';
import { UpdateFunctionalDto } from 'src/dto/functionals/update-functional.dto';
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
      order: { id: 'DESC' },
    });
  }

  async find(options: FindOneOptions<Functional>) {
    return await this.functionalRepository.find({
      select: {
        ...filterColumns(ENTITIES.FIELDS.FUNCTIONAL, removeColumns),
      } as FindOptionsSelect<Functional>,
      ...options,
    });
  }

  async create(
    createFunctionalDto: ICreate<CreateFunctionalDto>,
  ): Promise<Functional> {
    const { createBy, variable, transactionalEntityManager } =
      createFunctionalDto;
    const createParams = {
      code: variable.code,
      title: variable.title,
      createAt: new Date().toString(),
      createBy,
    } as Functional;

    if (transactionalEntityManager)
      return await transactionalEntityManager.save(Functional, createParams);

    return await this.functionalRepository.save(createParams);
  }

  async update(id: number, updateFunctionalDto: IUpdate<UpdateFunctionalDto>) {
    const { variable, updateBy, transactionalEntityManager } =
      updateFunctionalDto;
    const updateParams = {
      ...(variable.code && { code: variable.code }),
      ...(variable.title && { title: variable.title }),
      updateAt: new Date().toString(),
      updateBy,
    };

    if (transactionalEntityManager)
      return (
        (
          await (transactionalEntityManager as EntityManager).update(
            Functional,
            id,
            updateParams,
          )
        ).affected > 0
      );

    return (
      (await this.functionalRepository.update(id, updateParams)).affected > 0
    );
  }
}
