import { Test, TestingModule } from '@nestjs/testing';
import { MenuViewsService } from './menu_views.service';

describe('MenuViewsService', () => {
  let service: MenuViewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuViewsService],
    }).compile();

    service = module.get<MenuViewsService>(MenuViewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
