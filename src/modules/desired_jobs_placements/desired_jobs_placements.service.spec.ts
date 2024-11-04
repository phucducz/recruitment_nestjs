import { Test, TestingModule } from '@nestjs/testing';
import { DesiredJobsPlacementsService } from '../services/desired_jobs_placements.service';

describe('DesiredJobsPlacementsService', () => {
  let service: DesiredJobsPlacementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesiredJobsPlacementsService],
    }).compile();

    service = module.get<DesiredJobsPlacementsService>(DesiredJobsPlacementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
