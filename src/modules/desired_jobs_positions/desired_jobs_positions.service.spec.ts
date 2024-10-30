import { Test, TestingModule } from '@nestjs/testing';
import { DesiredJobsPositionsService } from '../services/desired_jobs_positions.service';

describe('DesiredJobsPositionsService', () => {
  let service: DesiredJobsPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesiredJobsPositionsService],
    }).compile();

    service = module.get<DesiredJobsPositionsService>(DesiredJobsPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
