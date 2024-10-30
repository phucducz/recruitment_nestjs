import { Test, TestingModule } from '@nestjs/testing';

import { DesiredJobsController } from './desired_jobs.controller';
import { DesiredJobsService } from '../../services/desired_jobs.service';

describe('DesiredJobsController', () => {
  let controller: DesiredJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesiredJobsController],
      providers: [DesiredJobsService],
    }).compile();

    controller = module.get<DesiredJobsController>(DesiredJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
