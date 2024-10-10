import { Test, TestingModule } from '@nestjs/testing';

import { CurriculumVitaesController } from './curriculum_vitaes.controller';
import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';

describe('CurriculumVitaesController', () => {
  let controller: CurriculumVitaesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurriculumVitaesController],
      providers: [CurriculumVitaesService],
    }).compile();

    controller = module.get<CurriculumVitaesController>(
      CurriculumVitaesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
