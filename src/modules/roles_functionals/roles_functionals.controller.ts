import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateRolesFunctionalDto } from 'src/dto/roles_functionals/create-roles_functional.dto';
import { UpdateRolesFunctionalDto } from 'src/dto/roles_functionals/update-roles_functional.dto';
import { RolesFunctionalsService } from 'src/services/roles_functionals.service';

@Controller('roles-functionals')
export class RolesFunctionalsController {
  constructor(
    private readonly rolesFunctionalsService: RolesFunctionalsService,
  ) {}

  @Post()
  create(@Body() createRolesFunctionalDto: CreateRolesFunctionalDto) {
    return this.rolesFunctionalsService.create(createRolesFunctionalDto);
  }

  @Get()
  findAll() {
    return this.rolesFunctionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesFunctionalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRolesFunctionalDto: UpdateRolesFunctionalDto,
  ) {
    return this.rolesFunctionalsService.update(+id, updateRolesFunctionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesFunctionalsService.remove(+id);
  }
}
