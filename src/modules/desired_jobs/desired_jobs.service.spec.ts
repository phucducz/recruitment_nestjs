import { Test, TestingModule } from '@nestjs/testing';
import { DesiredJobsService } from '../../services/desired_jobs.service';

describe('DesiredJobsService', () => {
  let service: DesiredJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesiredJobsService],
    }).compile();

    service = module.get<DesiredJobsService>(DesiredJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
