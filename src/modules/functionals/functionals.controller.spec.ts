import { Test, TestingModule } from '@nestjs/testing';
import { FunctionalsController } from './functionals.controller';
import { FunctionalsService } from '../services/functionals.service';

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
