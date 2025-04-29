import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateMenuViewGroupDto } from 'src/dto/menu_view_groups/create-menu_view_group.dto';
import { UpdateMenuViewGroupDto } from '../../dto/menu_view_groups/update-menu_view_group.dto';
import { MenuViewGroupsService } from '../../services/menu_view_groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menu-view-groups')
export class MenuViewGroupsController {
  constructor(private readonly menuViewGroupsService: MenuViewGroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Res() res: Response,
    @Request() request: any,
    @Body() createMenuViewGroupDto: CreateMenuViewGroupDto,
  ) {
    try {
      const result = await this.menuViewGroupsService.create({
        createBy: request.user.userId,
        variable: createMenuViewGroupDto,
      });

      if (!result)
        return res
          .status(401)
          .json({ message: 'Tạo nhóm chức năng thất bại!', statusCode: 401 });

      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo mới nhóm chức năng thành công!',
      });
    } catch (error) {
      return res.status(500).json({
        message: `Cập nhật menu không thành công. ${error?.message}`,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async findAll(
    @Query() menuViewGroupQueries: MenuViewGroupQueries,
    @Res() res: Response,
  ) {
    const { page, pageSize } = menuViewGroupQueries;
    const result =
      await this.menuViewGroupsService.findAll(menuViewGroupQueries);

    return res.status(200).json({
      statusCode: 200,
      ...rtPageInfoAndItems({ page, pageSize }, result),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuViewGroupsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Res() res: Response,
    @Request() request: any,
    @Param('id') id: string,
    @Body() updateMenuViewGroupDto: UpdateMenuViewGroupDto,
  ) {
    try {
      const result = this.menuViewGroupsService.update(+id, {
        updateBy: request.user.userId,
        variable: updateMenuViewGroupDto,
      });

      if (!result)
        return res.status(401).json({
          message: 'Cập nhật menu không thành công!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ statusCode: 200, message: 'Cập nhật menu thành công!' });
    } catch (error) {
      return res.status(500).json({
        message: `Cập nhật menu không thành công. ${error?.message}`,
        statusCode: 500,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.menuViewGroupsService.remove(+id);

      if (!result)
        return res.status(401).json({
          message: 'Xoá nhóm chức năng không thành công!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ statusCode: 200, message: 'Xoá nhóm chức năng thành công!' });
    } catch (error) {
      return res.status(500).json({
        message: `Xoá nhóm chức năng không thành công. ${error?.message}`,
        statusCode: 500,
      });
    }
  }
}
