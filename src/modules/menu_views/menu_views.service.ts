import { Injectable } from '@nestjs/common';
import { CreateMenuViewsDto } from 'src/dto/menu_views/create-menu_views.dto';
import { UpdateMenuViewsDto } from 'src/dto/menu_views/update-menu_views.dto';

@Injectable()
export class MenuViewsService {
  create(createMenuViewDto: CreateMenuViewsDto) {
    return 'This action adds a new menuView';
  }

  findAll() {
    return `This action returns all menuView`;
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
