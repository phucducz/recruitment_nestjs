import { Test, TestingModule } from '@nestjs/testing';
import { WorkTypesService } from '../../services/work_types.service';

describe('WorkTypesService', () => {
  let service: WorkTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkTypesService],
    }).compile();

    service = module.get<WorkTypesService>(WorkTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
