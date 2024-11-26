import { Injectable } from '@nestjs/common';

import { CreateRolesFunctionalDto } from 'src/dto/roles_functionals/create-roles_functional.dto';
import { UpdateRolesFunctionalDto } from 'src/dto/roles_functionals/update-roles_functional.dto';

@Injectable()
export class RolesFunctionalsService {
  create(createRolesFunctionalDto: CreateRolesFunctionalDto) {
    return 'This action adds a new rolesFunctional';
  }

  findAll() {
    return `This action returns all rolesFunctionals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolesFunctional`;
  }

  update(id: number, updateRolesFunctionalDto: UpdateRolesFunctionalDto) {
    return `This action updates a #${id} rolesFunctional`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolesFunctional`;
  }
}
