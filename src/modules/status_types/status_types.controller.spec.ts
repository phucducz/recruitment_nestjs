import { Test, TestingModule } from '@nestjs/testing';
import { StatusTypesController } from './status_types.controller';
import { StatusTypesService } from '../services/status_types.service';

describe('StatusTypesController', () => {
  let controller: StatusTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusTypesController],
      providers: [StatusTypesService],
    }).compile();

    controller = module.get<StatusTypesController>(StatusTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
