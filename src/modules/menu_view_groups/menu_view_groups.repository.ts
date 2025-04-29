import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import {
  Between,
  EntityManager,
  FindOptionsSelect,
  In,
  Raw,
  Repository,
} from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import {
  filterColumns,
  getItemsDiff,
  getPaginationParams,
} from 'src/common/utils/function';
import { CreateMenuViewGroupDto } from 'src/dto/menu_view_groups/create-menu_view_group.dto';
import { UpdateMenuViewGroupDto } from 'src/dto/menu_view_groups/update-menu_view_group.dto';
import { MenuViewGroup } from 'src/entities/menu_view_group.entity';
import { MenuViews } from 'src/entities/menu_views.entity';

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

  async create(
    createMenuViewGroupDto: ICreate<
      CreateMenuViewGroupDto & { menuViews: MenuViews[] }
    >,
  ) {
    const { createBy, variable, transactionalEntityManager } =
      createMenuViewGroupDto;

    const { menuViewIds, ...rest } = variable;
    const createParams = {
      ...rest,
      createBy,
      createAt: new Date().toString(),
    } as MenuViewGroup;

    if (transactionalEntityManager)
      return await transactionalEntityManager.save(MenuViewGroup, createParams);

    return await this.menuViewGroupRepository.save(createParams);
  }

  async update(
    id: number,
    updateMenuViewGroupDto: IUpdate<
      UpdateMenuViewGroupDto & {
        menuViews?: MenuViews[];
        storedMenuViews?: MenuViews[];
      }
    >,
  ) {
    const { updateBy, variable, transactionalEntityManager } =
      updateMenuViewGroupDto;

    const { title, orderIndex, description } = variable;
    const updateParams = {
      ...(title && { title }),
      ...(orderIndex && { orderIndex }),
      ...(description && { description }),
      updateAt: new Date().toString(),
      updateBy,
    };

    const { itemsToAdd, itemsToRemove } = getItemsDiff({
      items: { data: variable.menuViews, key: 'id' },
      storedItems: { data: variable.storedMenuViews, key: 'id' },
    });

    if (itemsToAdd.length > 0 || itemsToRemove.length > 0) {
      if (transactionalEntityManager)
        await transactionalEntityManager
          .createQueryBuilder()
          .relation(MenuViewGroup, 'menuViews')
          .of(id)
          .addAndRemove(itemsToAdd, itemsToRemove);
      else
        await this.menuViewGroupRepository
          .createQueryBuilder()
          .relation(MenuViewGroup, 'menuViews')
          .of(id)
          .addAndRemove(itemsToAdd, itemsToRemove);
    }

    if (transactionalEntityManager)
      return (
        (
          await (transactionalEntityManager as EntityManager).update(
            MenuViewGroup,
            id,
            updateParams,
          )
        ).affected > 0
      );

    return this.menuViewGroupRepository.update(id, updateParams);
  }

  async remove(id: number) {
    return await this.menuViewGroupRepository.delete(id);
  }
}
