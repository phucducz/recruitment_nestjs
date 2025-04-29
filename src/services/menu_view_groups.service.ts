import { Inject, Injectable } from '@nestjs/common';

import { CreateMenuViewGroupDto } from 'src/dto/menu_view_groups/create-menu_view_group.dto';
import { MenuViewGroupRepository } from 'src/modules/menu_view_groups/menu_view_groups.repository';
import { MenuViewRepository } from 'src/modules/menu_views/menu_views.repository';
import { UpdateMenuViewGroupDto } from '../dto/menu_view_groups/update-menu_view_group.dto';

@Injectable()
export class MenuViewGroupsService {
  constructor(
    @Inject()
    private readonly menuViewGroupRepository: MenuViewGroupRepository,
    @Inject()
    private readonly menuViewRepository: MenuViewRepository,
  ) {}

  async create(createMenuViewGroupDto: ICreate<CreateMenuViewGroupDto>) {
    const { variable } = createMenuViewGroupDto;

    return await this.menuViewGroupRepository.create({
      ...createMenuViewGroupDto,
      variable: {
        ...variable,
        menuViews: await this.menuViewRepository.findByIds(
          variable.menuViewIds,
        ),
      },
    });
  }

  async findAll(menuViewGroupQueries: MenuViewGroupQueries) {
    return await this.menuViewGroupRepository.findAll(menuViewGroupQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} menuViewGroup`;
  }

  async update(
    id: number,
    updateMenuViewGroupDto: IUpdate<UpdateMenuViewGroupDto>,
  ) {
    const { variable } = updateMenuViewGroupDto;

    return await this.menuViewGroupRepository.update(id, {
      ...updateMenuViewGroupDto,
      variable: {
        ...variable,
        menuViews: await this.menuViewRepository.findByIds(
          variable.menuViewIds,
        ),
        storedMenuViews: await this.menuViewRepository.find({
          where: { group: { id } },
        }),
      },
    });
  }

  async remove(id: number) {
    return await this.menuViewGroupRepository.remove(id);
  }
}
