import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
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

  @Get('/all')
  async findAll(
    @Body() functionalQueries: FunctionalQueries,
    @Res() res: Response,
  ) {
    const { page, pageSize } = functionalQueries;
    const result = await this.functionalsService.findAll(functionalQueries);

    return res.status(200).json({
      statusCode: 200,
      ...rtPageInfoAndItems({ page, pageSize }, result),
    });
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
