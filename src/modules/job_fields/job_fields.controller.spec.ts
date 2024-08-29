import { Test, TestingModule } from '@nestjs/testing';
import { JobFieldsController } from './job_fields.controller';
import { JobFieldsService } from './job_fields.service';

describe('JobFieldsController', () => {
  let controller: JobFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobFieldsController],
      providers: [JobFieldsService],
    }).compile();

    controller = module.get<JobFieldsController>(JobFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
