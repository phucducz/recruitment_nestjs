import { Test, TestingModule } from '@nestjs/testing';
import { JobFieldsService } from './job_fields.service';

describe('JobFieldsService', () => {
  let service: JobFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobFieldsService],
    }).compile();

    service = module.get<JobFieldsService>(JobFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
