import { Test, TestingModule } from '@nestjs/testing';
import { JobRecomendationsService } from '../services/job_recomendations.service';

describe('JobRecomendationsService', () => {
  let service: JobRecomendationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobRecomendationsService],
    }).compile();

    service = module.get<JobRecomendationsService>(JobRecomendationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
