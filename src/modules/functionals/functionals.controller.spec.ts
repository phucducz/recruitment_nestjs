import { Test, TestingModule } from '@nestjs/testing';

import { FunctionalsService } from 'src/services/functionals.service';
import { FunctionalsController } from './functionals.controller';

describe('FunctionalsController', () => {
  let controller: FunctionalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunctionalsController],
      providers: [FunctionalsService],
    }).compile();

    controller = module.get<FunctionalsController>(FunctionalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
