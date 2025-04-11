import { Test, TestingModule } from '@nestjs/testing';

import { FunctionalGroupsService } from 'src/services/functional_groups.service';

describe('FunctionalGroupsService', () => {
  let service: FunctionalGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunctionalGroupsService],
    }).compile();

    service = module.get<FunctionalGroupsService>(FunctionalGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
