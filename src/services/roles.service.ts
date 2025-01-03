import { Inject, Injectable, Logger } from '@nestjs/common';

import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
import { RolesRepository } from 'src/modules/roles/roles.repository';
import { FunctionalsService } from './functionals.service';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesRepository.name);

  constructor(
    @Inject(RolesRepository) private readonly roleRepository: RolesRepository,
    @Inject(FunctionalsService)
    private readonly funtionalService: FunctionalsService,
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
    return await this.roleRepository.create(createRoleDto);
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
