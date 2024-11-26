import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateFunctionalDto } from 'src/dto/functionals/create-functional.dto';
import { UpdateFunctionalDto } from 'src/dto/functionals/update-functional.dto';
import { FunctionalsService } from 'src/services/functionals.service';

@Controller('functionals')
export class FunctionalsController {
  constructor(private readonly functionalsService: FunctionalsService) {}

  @Post()
  create(@Body() createFunctionalDto: CreateFunctionalDto) {
    return this.functionalsService.create(createFunctionalDto);
  }

  @Get()
  findAll() {
    return this.functionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.functionalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFunctionalDto: UpdateFunctionalDto,
  ) {
    return this.functionalsService.update(+id, updateFunctionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.functionalsService.remove(+id);
  }
}
