import { Test, TestingModule } from '@nestjs/testing';

import { FunctionalGroupsService } from 'src/services/functional_groups.service';
import { FunctionalGroupsController } from './functional_groups.controller';

describe('FunctionalGroupsController', () => {
  let controller: FunctionalGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunctionalGroupsController],
      providers: [FunctionalGroupsService],
    }).compile();

    controller = module.get<FunctionalGroupsController>(
      FunctionalGroupsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
