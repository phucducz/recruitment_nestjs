import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CreateRolesFunctionalDto } from 'src/dto/roles_functionals/create-roles_functional.dto';
import { UpdateRolesFunctionalDto } from 'src/dto/roles_functionals/update-roles_functional.dto';
import { RolesFunctionalRepository } from 'src/modules/roles_functionals/roles_functional.repository';
import { FunctionalsService } from './functionals.service';
import { RolesService } from './roles.service';

@Injectable()
export class RolesFunctionalsService {
  constructor(
    @Inject(RolesFunctionalRepository)
    private readonly rolesFunctionalRepository: RolesFunctionalRepository,
    @Inject(forwardRef(() => RolesService))
    private readonly roleService: RolesService,
    @Inject(FunctionalsService)
    private readonly functionalService: FunctionalsService,
  ) {}

  async create(createRolesFunctionalDto: ICreate<CreateRolesFunctionalDto>) {
    const { variable } = createRolesFunctionalDto;

    return await this.rolesFunctionalRepository.create({
      ...createRolesFunctionalDto,
      variable: {
        ...variable,
        role: await this.roleService.findById(variable.rolesId),
        functional: await this.functionalService.findById(
          variable.functionalsId,
        ),
      },
    });
  }

  findAll() {
    return `This action returns all rolesFunctionals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolesFunctional`;
  }

  update(id: number, updateRolesFunctionalDto: UpdateRolesFunctionalDto) {
    console.log(updateRolesFunctionalDto);
    return `This action updates a #${id} rolesFunctional`;
  }

  async remove(id: number) {
    return await this.rolesFunctionalRepository.remove(id);
  }
}
