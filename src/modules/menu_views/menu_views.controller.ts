import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMenuViewsDto } from 'src/dto/menu_views/create-menu_views.dto';
import { UpdateMenuViewsDto } from 'src/dto/menu_views/update-menu_views.dto';
import { MenuViewsService } from './menu_views.service';

@Controller('menu-view')
export class MenuViewsController {
  constructor(private readonly menuViewService: MenuViewsService) {}

  @Post()
  create(@Body() createMenuViewDto: CreateMenuViewsDto) {
    return this.menuViewService.create(createMenuViewDto);
  }

  @Get()
  findAll() {
    return this.menuViewService.findAll();
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
