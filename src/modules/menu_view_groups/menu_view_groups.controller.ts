import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuViewGroupsService } from './menu_view_groups.service';
import { UpdateMenuViewGroupDto } from '../../dto/menu_view_groups/update-menu_view_group.dto';
import { CreateMenuViewGroupDto } from 'src/dto/menu_view_groups/create-menu_view_group.dto';

@Controller('menu-view-groups')
export class MenuViewGroupsController {
  constructor(private readonly menuViewGroupsService: MenuViewGroupsService) {}

  @Post()
  create(@Body() createMenuViewGroupDto: CreateMenuViewGroupDto) {
    return this.menuViewGroupsService.create(createMenuViewGroupDto);
  }

  @Get()
  findAll() {
    return this.menuViewGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuViewGroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuViewGroupDto: UpdateMenuViewGroupDto) {
    return this.menuViewGroupsService.update(+id, updateMenuViewGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuViewGroupsService.remove(+id);
  }
}
