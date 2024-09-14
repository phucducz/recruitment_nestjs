import { Test, TestingModule } from '@nestjs/testing';
import { ProvincesService } from '../../services/provinces.service';

describe('ProvincesService', () => {
  let service: ProvincesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProvincesService],
    }).compile();

    service = module.get<ProvincesService>(ProvincesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
