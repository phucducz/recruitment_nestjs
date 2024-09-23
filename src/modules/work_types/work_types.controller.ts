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

import { rtPageInfoAndItems } from 'src/common/utils/function';
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
        return res.status(200).json({
          statusCode: 200,
          message: 'Thêm thành công!',
          record: result,
        });

      return res.status(401).json({
        statusCode: 401,
        message: 'Thêm mới không thành công!',
        record: null,
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
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
        return res.status(200).json({
          statusCode: 200,
          message: 'Thêm thành công!',
          records: result,
        });

      return res.status(401).json({
        statusCode: 401,
        message: 'Thêm mới không thành công!',
        records: [],
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
    }
  }

  @Get('/all')
  async findAll(@Body() pagination: PaginationDto, @Res() res: Response) {
    const result = await this.workTypesService.findAll(pagination);

    return res.status(200).json({ ...rtPageInfoAndItems(pagination, result) });
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
