import { Test, TestingModule } from '@nestjs/testing';
import { MenuViewGroupsController } from './menu_view_groups.controller';
import { MenuViewGroupsService } from '../../services/menu_view_groups.service';

describe('MenuViewGroupsController', () => {
  let controller: MenuViewGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuViewGroupsController],
      providers: [MenuViewGroupsService],
    }).compile();

    controller = module.get<MenuViewGroupsController>(MenuViewGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
