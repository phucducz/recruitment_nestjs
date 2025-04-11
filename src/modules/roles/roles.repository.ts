import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Raw, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import {
  filterColumns,
  getItemsDiff,
  getPaginationParams,
} from 'src/common/utils/function';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
import { Functional } from 'src/entities/functional.entity';
import { Role } from 'src/entities/role.entity';
import { RolesFunctional } from 'src/entities/roles_functional.entity';

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

  async findAll(findAllQueries: IFindRoleQueries): Promise<[Role[], number]> {
    const { page, pageSize, id, title, functionalIds } = findAllQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    const [roles, totalItems] = await this.rolesRepository.findAndCount({
      where: {
        ...(id && { id: +id }),
        ...(title && {
          title: Raw((value: string) => `${value} ILIKE '%${title}%'`),
        }),
        ...(functionalIds && {
          rolesFunctionals: {
            functionalsId: In(functionalIds),
          },
        }),
      },
      select: { id: true },
      ...paginationParams,
    });

    return [
      await this.rolesRepository.find({
        where: { id: In(roles?.map((role) => role.id)) },
        relations: [
          'creator',
          'updater',
          'rolesFunctionals',
          'rolesFunctionals.role',
          'rolesFunctionals.functional',
        ],
        select: {
          creator: { id: true, fullName: true },
          updater: { id: true, fullName: true },
          rolesFunctionals: {
            ...filterColumns(ENTITIES.FIELDS.ROLES_FUNCTIONAL, removeColumns),
            role: filterColumns(ENTITIES.FIELDS.ROLE, removeColumns),
            functional: filterColumns(
              ENTITIES.FIELDS.FUNCTIONAL,
              removeColumns,
            ),
          },
        },
      }),
      totalItems,
    ];
  }

  async create(createRole: ICreate<CreateRoleDto>) {
    const { createBy, variable } = createRole;

    return await this.rolesRepository.save({
      createAt: new Date().toString(),
      createBy: createBy,
      title: variable.title,
      ...(variable.description && { description: variable.description }),
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

  async update(
    id: number,
    updateRoleDto: IUpdate<
      UpdateRoleDto & {
        storedFunctional: Functional[];
        newFunctionals: Functional[];
      }
    >,
  ) {
    const { updateBy, variable, transactionalEntityManager } = updateRoleDto;
    const updateParams = {
      ...(typeof variable.description !== undefined && {
        description: variable.description,
      }),
      ...(variable.title && { title: variable.title }),
      updateAt: new Date().toString(),
      updateBy,
    };

    const { itemsToAdd, itemsToRemove } = getItemsDiff({
      items: { data: variable.newFunctionals, key: 'id' },
      storedItems: { data: variable.storedFunctional, key: 'id' },
    });

    if (itemsToAdd.length > 0 || itemsToRemove.length > 0) {
      const queryRunner =
        transactionalEntityManager || this.rolesRepository.manager;

      if (itemsToRemove.length > 0) {
        await queryRunner
          .createQueryBuilder()
          .delete()
          .from(RolesFunctional)
          .where('rolesId = :roleId AND functionalsId IN (:...functionalIds)', {
            roleId: id,
            functionalIds: itemsToRemove.map((item) => item.id),
          })
          .execute();
      }

      if (itemsToAdd.length > 0) {
        const newRelations = itemsToAdd.map((item) => ({
          rolesId: id,
          functionalsId: item.id,
        }));

        await queryRunner
          .createQueryBuilder()
          .insert()
          .into(RolesFunctional)
          .values(newRelations)
          .execute();
      }
    }

    if (transactionalEntityManager)
      return await (transactionalEntityManager as EntityManager).update(
        Role,
        id,
        updateParams,
      );

    return await this.rolesRepository.update(id, updateParams);
  }

  async delete(id: number) {
    return (await this.rolesRepository.delete(id)).affected > 0;
  }
}
