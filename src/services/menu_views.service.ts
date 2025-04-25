import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuViewsDto } from 'src/dto/menu_views/create-menu_views.dto';
import { UpdateMenuViewsDto } from 'src/dto/menu_views/update-menu_views.dto';
import { FunctionalRepository } from 'src/modules/functionals/functional.repository';
import { MenuViewRepository } from 'src/modules/menu_views/menu_views.repository';

@Injectable()
export class MenuViewsService {
  constructor(
    @Inject() private readonly menuViewRepository: MenuViewRepository,
    @Inject() private readonly functionalRepository: FunctionalRepository,
  ) {}

  async create(createMenuViewDto: ICreate<CreateMenuViewsDto>) {
    const { variable } = createMenuViewDto;

    return this.menuViewRepository.create({
      ...createMenuViewDto,
      variable: {
        ...variable,
        functionals: await this.functionalRepository.findByIds(
          variable.functionalIds,
        ),
      },
    });
  }

  async findAll(menuViewQueries: MenuViewQueries) {
    return await this.menuViewRepository.findAll(menuViewQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} menuView`;
  }

  async update(id: number, updateMenuViewDto: IUpdate<UpdateMenuViewsDto>) {
    const { variable } = updateMenuViewDto;

    return await this.menuViewRepository.update(id, {
      ...updateMenuViewDto,
      variable: {
        ...variable,
        functionals: await this.functionalRepository.findByIds(
          variable.functionalIds,
        ),
        storedFunctionals: await this.functionalRepository.find({
          where: { menuViewId: id },
        }),
      },
    });
  }

  async remove(id: number) {
    return await this.menuViewRepository.remove(id);
  }
}
