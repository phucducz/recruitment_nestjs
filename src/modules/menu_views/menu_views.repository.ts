import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import {
  Between,
  EntityManager,
  FindOptionsSelect,
  Raw,
  Repository,
} from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import {
  filterColumns,
  getItemsDiff,
  getPaginationParams,
} from 'src/common/utils/function';
import { CreateMenuViewsDto } from 'src/dto/menu_views/create-menu_views.dto';
import { UpdateMenuViewsDto } from 'src/dto/menu_views/update-menu_views.dto';
import { Functional } from 'src/entities/functional.entity';
import { MenuViews } from 'src/entities/menu_views.entity';

@Injectable()
export class MenuViewRepository {
  constructor(
    @InjectRepository(MenuViews)
    private readonly menuViewRepository: Repository<MenuViews>,
  ) {}

  async findAll(menuViewQueries: MenuViewQueries) {
    const {
      page,
      pageSize,
      title,
      path,
      iconType,
      orderIndex,
      type,
      createdDate,
    } = menuViewQueries;

    const paginationParams =
      type !== 'combobox' ? getPaginationParams({ page, pageSize }) : {};

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
      relations: ['creator', 'updater', 'functionals'],
      select: {
        creator: { id: true, fullName: true },
        updater: { id: true, fullName: true },
        functionals: filterColumns(ENTITIES.FIELDS.FUNCTIONAL, removeColumns),
        ...filterColumns(ENTITIES.FIELDS.MENU_VIEW, ['createBy', 'updateBy']),
      } as FindOptionsSelect<MenuViews>,
      order: { createAt: 'DESC' },
    });
  }

  async create(
    createMenuViewsDto: ICreate<
      CreateMenuViewsDto & { functionals?: Functional[] }
    >,
  ): Promise<MenuViews> {
    console.log(createMenuViewsDto);
    const { createBy, variable, transactionalEntityManager } =
      createMenuViewsDto;

    const createParams = {
      title: variable.title,
      path: variable.path,
      iconType: variable.iconType,
      icon: variable.icon,
      orderIndex: variable.orderIndex,
      functionals: variable.functionals,
      createBy,
      createAt: new Date().toString(),
    } as MenuViews;

    // console.log('createParams', createParams);

    // return {} as MenuViews;

    if (transactionalEntityManager)
      return await transactionalEntityManager.save(MenuViews, createParams);

    return await this.menuViewRepository.save(createParams);
  }

  async update(
    id: number,
    updateMenuViewsDto: IUpdate<
      UpdateMenuViewsDto & {
        functionals?: Functional[];
        storedFunctionals?: Functional[];
      }
    >,
  ) {
    const { variable, updateBy, transactionalEntityManager } =
      updateMenuViewsDto;

    const updateParams = {
      ...(variable.icon && { icon: variable.icon }),
      ...(variable.path && { path: variable.path }),
      ...(variable.title && { title: variable.title }),
      ...(variable.iconType && { iconType: variable.iconType }),
      ...(variable.orderIndex && { orderIndex: variable.orderIndex }),
      updateAt: new Date().toString(),
      updateBy,
    };

    const { itemsToAdd, itemsToRemove } = getItemsDiff({
      items: { data: variable.functionals, key: 'id' },
      storedItems: { data: variable.storedFunctionals, key: 'id' },
    });

    if (itemsToAdd.length > 0 || itemsToRemove.length > 0) {
      if (transactionalEntityManager)
        await transactionalEntityManager
          .createQueryBuilder()
          .relation(MenuViews, 'functionals')
          .of(id)
          .addAndRemove(itemsToAdd, itemsToRemove);
      else
        await this.menuViewRepository
          .createQueryBuilder()
          .relation(MenuViews, 'functionals')
          .of(id)
          .addAndRemove(itemsToAdd, itemsToRemove);
    }

    if (transactionalEntityManager)
      return (
        (
          await (transactionalEntityManager as EntityManager).update(
            MenuViews,
            id,
            updateParams,
          )
        ).affected > 0
      );

    return this.menuViewRepository.update(id, updateParams);
  }

  async remove(id: number) {
    return (await this.menuViewRepository.delete(id)).affected > 0;
  }
}
