import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumVitaesService } from '../services/curriculum_vitaes.service';

describe('CurriculumVitaesService', () => {
  let service: CurriculumVitaesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurriculumVitaesService],
    }).compile();

    service = module.get<CurriculumVitaesService>(CurriculumVitaesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
