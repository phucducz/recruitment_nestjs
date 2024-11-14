import { Test, TestingModule } from '@nestjs/testing';

import { DesiredJobsPositionsService } from 'src/services/desired_jobs_positions.service';
import { DesiredJobsPositionsController } from './desired_jobs_positions.controller';

describe('DesiredJobsPositionsController', () => {
  let controller: DesiredJobsPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesiredJobsPositionsController],
      providers: [DesiredJobsPositionsService],
    }).compile();

    controller = module.get<DesiredJobsPositionsController>(
      DesiredJobsPositionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
