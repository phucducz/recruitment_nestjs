import { Test, TestingModule } from '@nestjs/testing';
import { JobsPlacementsController } from './jobs_placements.controller';
import { JobsPlacementsService } from './jobs_placements.service';

describe('JobsPlacementsController', () => {
  let controller: JobsPlacementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsPlacementsController],
      providers: [JobsPlacementsService],
    }).compile();

    controller = module.get<JobsPlacementsController>(JobsPlacementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
