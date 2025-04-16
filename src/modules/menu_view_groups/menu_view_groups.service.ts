import { Injectable } from '@nestjs/common';
import { UpdateMenuViewGroupDto } from '../../dto/menu_view_groups/update-menu_view_group.dto';
import { CreateMenuViewGroupDto } from 'src/dto/menu_view_groups/create-menu_view_group.dto';

@Injectable()
export class MenuViewGroupsService {
  create(createMenuViewGroupDto: CreateMenuViewGroupDto) {
    return 'This action adds a new menuViewGroup';
  }

  findAll() {
    return `This action returns all menuViewGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuViewGroup`;
  }

  update(id: number, updateMenuViewGroupDto: UpdateMenuViewGroupDto) {
    return `This action updates a #${id} menuViewGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuViewGroup`;
  }
}
