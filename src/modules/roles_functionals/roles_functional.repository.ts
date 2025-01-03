import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateRolesFunctionalDto } from 'src/dto/roles_functionals/create-roles_functional.dto';
import { Functional } from 'src/entities/functional.entity';
import { Role } from 'src/entities/role.entity';
import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { getPaginationParams } from 'src/common/utils/function';

@Injectable()
export class RolesFunctionalRepository {
  constructor(
    @InjectRepository(RolesFunctional)
    private readonly rolesFunctionalRepository: Repository<RolesFunctional>,
  ) {}

  async create(
    createRolesFunctionalDto: ICreate<
      CreateRolesFunctionalDto & { functional: Functional; role: Role }
    >,
  ): Promise<RolesFunctional> {
    const { createBy, variable, transactionalEntityManager } =
      createRolesFunctionalDto;
    const createParams = {
      functional: variable.functional,
      role: variable.role,
      createBy,
      createAt: new Date().toString(),
    };

    if (transactionalEntityManager)
      return await (transactionalEntityManager as EntityManager).save(
        RolesFunctional,
        createParams,
      );

    return await this.rolesFunctionalRepository.save(createParams);
  }

  async remove(id: number) {
    return (await this.rolesFunctionalRepository.delete(id)).affected > 0;
  }

  async findAll(rolesFunctionalQueries: RolesFunctionalQueries) {
    const { page, pageSize } = rolesFunctionalQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.rolesFunctionalRepository.findAndCount({
      ...paginationParams,
    });
  }
}
