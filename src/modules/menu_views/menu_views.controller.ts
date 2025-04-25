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
import { CreateMenuViewsDto } from 'src/dto/menu_views/create-menu_views.dto';
import { UpdateMenuViewsDto } from 'src/dto/menu_views/update-menu_views.dto';
import { MenuViewsService } from '../../services/menu_views.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menu-view')
export class MenuViewsController {
  constructor(private readonly menuViewService: MenuViewsService) {}

  @Get('/all')
  async findAll(
    @Query() menuViewQueries: MenuViewQueries,
    @Res() res: Response,
  ) {
    const { page, pageSize } = menuViewQueries;
    const result = await this.menuViewService.findAll(menuViewQueries);

    return res.status(200).json({
      statusCode: 200,
      ...rtPageInfoAndItems({ page, pageSize }, result),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuViewService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Res() res: Response,
    @Request() request: any,
    @Body() createMenuViewDto: CreateMenuViewsDto,
  ) {
    try {
      const result = this.menuViewService.create({
        createBy: request.user.userId,
        variable: createMenuViewDto,
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
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuViewDto: UpdateMenuViewsDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const result = await this.menuViewService.update(+id, {
        updateBy: request.user.userId,
        variable: updateMenuViewDto,
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
  remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = this.menuViewService.remove(+id);

      if (!result)
        return res.status(401).json({
          message: 'Xoá menu không thành công!',
          statusCode: 401,
        });

      return res
        .status(200)
        .json({ statusCode: 200, message: 'Xoá menu thành công!' });
    } catch (error) {
      return res.status(500).json({
        message: `Xoá menu không thành công. ${error?.message}`,
        statusCode: 500,
      });
    }
  }
}
