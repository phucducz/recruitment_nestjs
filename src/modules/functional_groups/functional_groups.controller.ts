import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateFunctionalGroupDto } from 'src/dto/functionals/create-functional_group.dto';
import { UpdateFunctionalGroupDto } from 'src/dto/functionals/update-functional_group.dto';
import { FunctionalGroupsService } from 'src/services/functional_groups.service';

@Controller('functional-groups')
export class FunctionalGroupsController {
  constructor(
    private readonly functionalGroupsService: FunctionalGroupsService,
  ) {}

  @Post()
  create(@Body() createFunctionalGroupDto: CreateFunctionalGroupDto) {
    return this.functionalGroupsService.create(createFunctionalGroupDto);
  }

  @Get()
  findAll() {
    return this.functionalGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.functionalGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFunctionalGroupDto: UpdateFunctionalGroupDto,
  ) {
    return this.functionalGroupsService.update(+id, updateFunctionalGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.functionalGroupsService.remove(+id);
  }
}
