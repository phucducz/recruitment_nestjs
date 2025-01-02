import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateFunctionalDto } from 'src/dto/functionals/create-functional.dto';
import { UpdateFunctionalDto } from 'src/dto/functionals/update-functional.dto';
import { FunctionalsService } from 'src/services/functionals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('functionals')
export class FunctionalsController {
  constructor(private readonly functionalsService: FunctionalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createFunctionalDto: CreateFunctionalDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.functionalsService.create({
        createBy: request.user.userId,
        variable: createFunctionalDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Tạo chức năng không thành công!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ statusCode: 200, message: 'Tạo chức năng thành công!' });
    } catch (error) {
      return res.status(500).json({
        message: `Tạo chức năng không thành công. ${error?.message}`,
        statusCode: 500,
      });
    }
  }

  @Get('/all')
  async findAll(
    @Query() functionalQueries: FunctionalQueries,
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFunctionalDto: UpdateFunctionalDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.functionalsService.update(+id, {
        updateBy: request.user.userId,
        variable: updateFunctionalDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật chức năng không thành công!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ statusCode: 200, message: 'Cập nhật chức năng thành công!' });
    } catch (error) {
      return res.status(500).json({
        message: `Cập nhật chức năng không thành công. ${error?.message}`,
        statusCode: 500,
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.functionalsService.remove(+id);
  }
}
