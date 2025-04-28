import { Inject, Injectable } from '@nestjs/common';

import { CreateMenuViewGroupDto } from 'src/dto/menu_view_groups/create-menu_view_group.dto';
import { MenuViewGroupRepository } from 'src/modules/menu_view_groups/menu_view_groups.repository';
import { UpdateMenuViewGroupDto } from '../dto/menu_view_groups/update-menu_view_group.dto';

@Injectable()
export class MenuViewGroupsService {
  constructor(
    @Inject()
    private readonly menuViewGroupRepository: MenuViewGroupRepository,
  ) {}

  create(createMenuViewGroupDto: CreateMenuViewGroupDto) {
    return 'This action adds a new menuViewGroup';
  }

  async findAll(menuViewGroupQueries: MenuViewGroupQueries) {
    return await this.menuViewGroupRepository.findAll(menuViewGroupQueries);
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
