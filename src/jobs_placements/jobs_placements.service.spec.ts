import { Test, TestingModule } from '@nestjs/testing';
import { JobsPlacementsService } from './jobs_placements.service';

describe('JobsPlacementsService', () => {
  let service: JobsPlacementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsPlacementsService],
    }).compile();

    service = module.get<JobsPlacementsService>(JobsPlacementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
