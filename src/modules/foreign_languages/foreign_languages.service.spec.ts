import { Test, TestingModule } from '@nestjs/testing';
import { ForeignLanguagesService } from '../../services/foreign_languages.service';

describe('ForeignLanguagesService', () => {
  let service: ForeignLanguagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForeignLanguagesService],
    }).compile();

    service = module.get<ForeignLanguagesService>(ForeignLanguagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
