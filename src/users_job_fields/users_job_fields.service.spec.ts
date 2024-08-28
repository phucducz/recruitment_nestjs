import { Test, TestingModule } from '@nestjs/testing';
import { UsersJobFieldsService } from './users_job_fields.service';

describe('UsersJobFieldsService', () => {
  let service: UsersJobFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersJobFieldsService],
    }).compile();

    service = module.get<UsersJobFieldsService>(UsersJobFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
