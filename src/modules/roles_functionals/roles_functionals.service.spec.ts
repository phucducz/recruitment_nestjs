import { Test, TestingModule } from '@nestjs/testing';

import { RolesFunctionalsService } from 'src/services/roles_functionals.service';

describe('RolesFunctionalsService', () => {
  let service: RolesFunctionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesFunctionalsService],
    }).compile();

    service = module.get<RolesFunctionalsService>(RolesFunctionalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
