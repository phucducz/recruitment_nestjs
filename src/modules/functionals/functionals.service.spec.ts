import { Test, TestingModule } from '@nestjs/testing';

import { FunctionalsService } from 'src/services/functionals.service';

describe('FunctionalsService', () => {
  let service: FunctionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunctionalsService],
    }).compile();

    service = module.get<FunctionalsService>(FunctionalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
