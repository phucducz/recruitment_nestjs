import { Test, TestingModule } from '@nestjs/testing';
import { UsersJobsService } from './users_jobs.service';

describe('UsersJobsService', () => {
  let service: UsersJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersJobsService],
    }).compile();

    service = module.get<UsersJobsService>(UsersJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
