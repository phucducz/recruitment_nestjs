import { Test, TestingModule } from '@nestjs/testing';

import { RolesFunctionalsService } from 'src/services/roles_functionals.service';
import { RolesFunctionalsController } from './roles_functionals.controller';

describe('RolesFunctionalsController', () => {
  let controller: RolesFunctionalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesFunctionalsController],
      providers: [RolesFunctionalsService],
    }).compile();

    controller = module.get<RolesFunctionalsController>(
      RolesFunctionalsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
