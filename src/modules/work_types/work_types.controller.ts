import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { CreateWorkTypeDto } from 'src/dto/work_types/create-work_type.dto';
import { WorkTypesService } from '../../services/work_types.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWorkTypeDto: CreateWorkTypeDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.workTypesService.create({
        createBy: request.user.userId,
        variable: createWorkTypeDto,
      });

      if (result.id)
        return res
          .status(200)
          .json({ message: 'Thêm thành công!', record: result });

      return res
        .status(401)
        .json({ message: 'Thêm mới không thành công!', record: null });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/many')
  async createMany(
    @Body() createManyWorkTypes: CreateWorkTypeDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.workTypesService.createMany({
        createBy: request.user.userId,
        variables: createManyWorkTypes,
      });

      if (result.length > 0)
        return res
          .status(200)
          .json({ message: 'Thêm thành công!', records: result });

      return res
        .status(401)
        .json({ message: 'Thêm mới không thành công!', records: [] });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  @Get('/all')
  findAll(@Body() pagination: PaginationDto) {
    return this.workTypesService.findAll(pagination);
  }

  @Get('?')
  findById(@Query('id') id: number) {
    return this.workTypesService.findById(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.workTypesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateWorkTypeDto: UpdateWorkTypeDto,
  // ) {
  //   return this.workTypesService.update(+id, updateWorkTypeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.workTypesService.remove(+id);
  // }
}
