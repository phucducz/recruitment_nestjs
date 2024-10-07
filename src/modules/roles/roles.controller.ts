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
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { RolesService } from 'src/services/roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      console.log(request.user);

      const result = await this.rolesService.create({
        createBy: request.user.userId,
        variable: createRoleDto,
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
    @Body() createManyRoleDto: CreateRoleDto[],
    @Request() request: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.rolesService.createMany({
        createBy: request.user.userId,
        variables: createManyRoleDto,
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

  @Get('/all?')
  async findAll(@Query() pagination: IPagination, @Res() res: Response) {
    const paginationParams = {
      page: +pagination.page,
      pageSize: +pagination.pageSize,
    };
    const result = await this.rolesService.findAll(paginationParams);

    return res.status(200).json({ ...rtPageInfoAndItems(paginationParams, result) });
  }

  @Get('?')
  findOne(@Query('id') id: number) {
    return this.rolesService.findById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
