import { Test, TestingModule } from '@nestjs/testing';
import { JobPositionsController } from './job_positions.controller';
import { JobPositionsService } from '../../services/job_positions.service';

describe('JobPositionsController', () => {
  let controller: JobPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPositionsController],
      providers: [JobPositionsService],
    }).compile();

    controller = module.get<JobPositionsController>(JobPositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
