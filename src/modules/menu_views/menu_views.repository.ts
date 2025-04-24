import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Between, FindOptionsSelect, Raw, Repository } from 'typeorm';

import { ENTITIES } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { MenuViews } from 'src/entities/menu_views.entity';

@Injectable()
export class MenuViewRepository {
  constructor(
    @InjectRepository(MenuViews)
    private readonly menuViewRepository: Repository<MenuViews>,
  ) {}

  async findAll(menuViewQueries: MenuViewQueries) {
    const { page, pageSize, title, path, iconType, orderIndex, createdDate } =
      menuViewQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.menuViewRepository.findAndCount({
      where: {
        ...(title && {
          title: Raw((value) => `${value} ILIKE :title`, {
            title: `%${title}%`,
          }),
        }),
        ...(path && {
          path: Raw((value) => `${value} ILIKE :path`, {
            path: `%${path}%`,
          }),
        }),
        ...(iconType && { iconType }),
        ...(orderIndex && { orderIndex }),
        ...(createdDate && {
          createAt: Between(
            dayjs(createdDate).startOf('day').toDate(),
            dayjs(createdDate).endOf('day').toDate(),
          ),
        }),
      },
      ...paginationParams,
      relations: ['creator', 'updater'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.MENU_VIEW, ['createBy', 'updateBy']),
        creator: { id: true, fullName: true },
        updater: { id: true, fullName: true },
      } as FindOptionsSelect<MenuViews>,
      order: { createAt: 'DESC' },
    });
  }
}
