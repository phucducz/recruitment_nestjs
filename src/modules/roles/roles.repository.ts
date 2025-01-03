import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { Role } from 'src/entities/role.entity';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { ENTITIES, removeColumns } from 'src/common/utils/constants';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return await this.rolesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByTitle(title: string) {
    return await this.rolesRepository.findOne({
      where: {
        title: title,
      },
    });
  }

  async findAll(findAllQueries: IFindRoleQueries) {
    const paginationParams = getPaginationParams({
      page: +findAllQueries.page,
      pageSize: +findAllQueries.pageSize,
    });

    return await this.rolesRepository.findAndCount({
      where: {
        ...(findAllQueries?.id && { id: +findAllQueries.id }),
      },
      relations: [
        'rolesFunctionals',
        'rolesFunctionals.role',
        'rolesFunctionals.functional',
      ],
      select: {
        rolesFunctionals: {
          ...filterColumns(ENTITIES.FIELDS.ROLES_FUNCTIONAL, removeColumns),
          role: filterColumns(ENTITIES.FIELDS.ROLE, removeColumns),
          functional: filterColumns(ENTITIES.FIELDS.FUNCTIONAL, removeColumns),
        },
      },
      ...paginationParams,
    });
  }

  async create(createRole: ICreate<CreateRoleDto>) {
    const { createBy, variable } = createRole;

    return await this.rolesRepository.save({
      createAt: new Date().toString(),
      createBy: createBy,
      title: variable.title,
    });
  }

  async createMany(createManyRoles: ICreateMany<CreateRoleDto>) {
    const { createBy, variables } = createManyRoles;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await Promise.all(
          variables.map(async (role) => {
            return (await transactionalEntityManager.save(Role, {
              createAt: new Date().toString(),
              createBy: createBy,
              title: role.title,
            })) as Role;
          }),
        );
      },
    );
  }
}
