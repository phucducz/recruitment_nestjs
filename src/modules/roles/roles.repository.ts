import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { Role } from 'src/entities/role.entity';

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

  async findAll(pagination: IPagination) {
    return await this.rolesRepository.find(pagination);
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
