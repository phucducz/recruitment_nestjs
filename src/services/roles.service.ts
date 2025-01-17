import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
import { RolesRepository } from 'src/modules/roles/roles.repository';
import { FunctionalsService } from './functionals.service';
import { RolesFunctionalsService } from './roles_functionals.service';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesRepository.name);

  constructor(
    @Inject(RolesRepository) private readonly roleRepository: RolesRepository,
    @Inject(FunctionalsService)
    private readonly funtionalService: FunctionalsService,
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(forwardRef(() => RolesFunctionalsService))
    private readonly rolesFunctionalService: RolesFunctionalsService,
  ) {}

  async findById(id: number) {
    return this.roleRepository.findById(id);
  }

  async findByTitle(title: 'user' | 'employer' | 'admin') {
    return this.roleRepository.findByTitle(title);
  }

  async findAll(findAllQueries: IFindRoleQueries) {
    return this.roleRepository.findAll(findAllQueries);
  }

  async create(createRoleDto: ICreate<CreateRoleDto>) {
    const { variable, createBy } = createRoleDto;
    const functionals =
      variable.functionalIds &&
      (await this.funtionalService.findByIds(variable.functionalIds));

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const newRole = await this.roleRepository.create({
          ...createRoleDto,
          transactionalEntityManager,
        });

        if (functionals)
          await Promise.all(
            functionals.map(
              async (func) =>
                await this.rolesFunctionalService.create({
                  createBy,
                  variable: { functionalsId: func.id, rolesId: newRole.id },
                  transactionalEntityManager,
                }),
            ),
          );

        return newRole;
      },
    );
  }

  async createMany(createManyRoleDto: ICreateMany<CreateRoleDto>) {
    return await this.roleRepository.createMany(createManyRoleDto);
  }

  async update(id: number, updateRoleDto: IUpdate<UpdateRoleDto>) {
    const { variable } = updateRoleDto;
    const [storedFunctional] = await this.funtionalService.findAll({
      rolesId: id.toString(),
    });

    return await this.roleRepository.update(id, {
      ...updateRoleDto,
      variable: {
        ...variable,
        storedFunctional,
        newFunctionals: await this.funtionalService.findByIds(
          variable.functionalIds,
        ),
      },
    });
  }
}
