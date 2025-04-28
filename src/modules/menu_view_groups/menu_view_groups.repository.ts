import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsSelect, In, Raw, Repository } from 'typeorm';

import dayjs from 'dayjs';
import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { MenuViewGroup } from 'src/entities/menu_view_group.entity';

export class MenuViewGroupRepository {
  constructor(
    @InjectRepository(MenuViewGroup)
    private readonly menuViewGroupRepository: Repository<MenuViewGroup>,
  ) {}

  async findAll(menuViewGroupQueries: MenuViewGroupQueries) {
    const { page, pageSize, title, orderIndex, createdDate, menuViewIds } =
      menuViewGroupQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.menuViewGroupRepository.findAndCount({
      where: {
        ...(title && {
          title: Raw((value) => `${value} ILIKE :title`, {
            title: `%${title}%`,
          }),
        }),
        ...(orderIndex && {
          orderIndex,
        }),
        ...(menuViewIds && {
          menuViews: {
            id: In(menuViewIds),
          },
        }),
        ...(createdDate && {
          createAt: Between(
            dayjs(createdDate).startOf('day').toDate(),
            dayjs(createdDate).endOf('day').toDate(),
          ),
        }),
      },
      ...paginationParams,
      relations: ['creator', 'updater', 'menuViews'],
      select: {
        creator: { id: true, fullName: true },
        updater: { id: true, fullName: true },
        menuViews: filterColumns(ENTITIES.FIELDS.MENU_VIEW, removeColumns),
        ...filterColumns(ENTITIES.FIELDS.MENU_VIEW_GROUP, [
          'createBy',
          'updateBy',
        ]),
      } as FindOptionsSelect<MenuViewGroup>,
      order: { createAt: 'DESC' },
    });
  }
}
