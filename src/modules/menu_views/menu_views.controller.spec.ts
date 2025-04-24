import { Test, TestingModule } from '@nestjs/testing';
import { MenuViewsController } from './menu_views.controller';
import { MenuViewsService } from '../../services/menu_views.service';

describe('MenuViewController', () => {
  let controller: MenuViewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuViewsController],
      providers: [MenuViewsService],
    }).compile();

    controller = module.get<MenuViewsController>(MenuViewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
