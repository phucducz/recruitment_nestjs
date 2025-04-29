import { Test, TestingModule } from '@nestjs/testing';
import { MenuViewGroupsService } from '../../services/menu_view_groups.service';

describe('MenuViewGroupsService', () => {
  let service: MenuViewGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuViewGroupsService],
    }).compile();

    service = module.get<MenuViewGroupsService>(MenuViewGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
