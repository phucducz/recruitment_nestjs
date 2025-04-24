import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuViewsDto } from 'src/dto/menu_views/create-menu_views.dto';
import { UpdateMenuViewsDto } from 'src/dto/menu_views/update-menu_views.dto';
import { MenuViewRepository } from 'src/modules/menu_views/menu_views.repository';

@Injectable()
export class MenuViewsService {
  constructor(
    @Inject() private readonly menuViewRepository: MenuViewRepository,
  ) {}

  create(createMenuViewDto: CreateMenuViewsDto) {
    return 'This action adds a new menuView';
  }

  async findAll(menuViewQueries: MenuViewQueries) {
    return await this.menuViewRepository.findAll(menuViewQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} menuView`;
  }

  update(id: number, updateMenuViewDto: UpdateMenuViewsDto) {
    return `This action updates a #${id} menuView`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuView`;
  }
}
