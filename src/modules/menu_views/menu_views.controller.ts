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
} from '@nestjs/common';
import { Response } from 'express';

import { rtPageInfoAndItems } from 'src/common/utils/function';
import { CreateMenuViewsDto } from 'src/dto/menu_views/create-menu_views.dto';
import { UpdateMenuViewsDto } from 'src/dto/menu_views/update-menu_views.dto';
import { MenuViewsService } from '../../services/menu_views.service';

@Controller('menu-view')
export class MenuViewsController {
  constructor(private readonly menuViewService: MenuViewsService) {}

  @Post()
  create(@Body() createMenuViewDto: CreateMenuViewsDto) {
    return this.menuViewService.create(createMenuViewDto);
  }

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuViewDto: UpdateMenuViewsDto,
  ) {
    return this.menuViewService.update(+id, updateMenuViewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuViewService.remove(+id);
  }
}
