import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
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

  @Get('/all')
  async findAll(
    @Query() findAllQueries: IFindRoleQueries,
    @Res() res: Response,
  ) {
    try {
      const result = await this.rolesService.findAll(findAllQueries);
      console.log(result);

      return res.status(200).json({
        ...rtPageInfoAndItems(
          {
            page: +findAllQueries.page,
            pageSize: +findAllQueries.pageSize,
          },
          result,
        ),
      });
    } catch (error) {
      return res.status(500).json({
        message: `Lỗi khi lấy danh sách chức vụ. ${error?.message}`,
        statusCode: 500,
      });
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   console.log('id');

  //   return this.rolesService.findById(+id);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.rolesService.update(+id, {
        updateBy: request.user.userId,
        variable: updateRoleDto,
      });

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Cập nhật chức vụ không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Cập nhật chức vụ thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `Cập nhật chức vụ không thành công. ${error?.message}`,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.rolesService.remove(+id);

      if (!result)
        return res.status(401).json({
          statusCode: 401,
          message: 'Xóa chức vụ không thành công!',
        });

      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa chức vụ thành công!',
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      return res.status(500).json({
        statusCode: 500,
        message: `Xóa chức vụ không thành công. ${error?.message ?? error}!`,
      });
    }
  }
}
