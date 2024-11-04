import { Test, TestingModule } from '@nestjs/testing';

import { DesiredJobsPlacementsService } from 'src/services/desired_jobs_placements.service';
import { DesiredJobsPlacementsController } from './desired_jobs_placements.controller';

describe('DesiredJobsPlacementsController', () => {
  let controller: DesiredJobsPlacementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesiredJobsPlacementsController],
      providers: [DesiredJobsPlacementsService],
    }).compile();

    controller = module.get<DesiredJobsPlacementsController>(
      DesiredJobsPlacementsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
