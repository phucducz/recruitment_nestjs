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

  @Post()
  create(@Body() createMenuViewGroupDto: CreateMenuViewGroupDto) {
    return this.menuViewGroupsService.create(createMenuViewGroupDto);
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuViewGroupDto: UpdateMenuViewGroupDto,
  ) {
    return this.menuViewGroupsService.update(+id, updateMenuViewGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuViewGroupsService.remove(+id);
  }
}
