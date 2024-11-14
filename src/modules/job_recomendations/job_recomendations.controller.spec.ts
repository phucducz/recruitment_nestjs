import { Test, TestingModule } from '@nestjs/testing';
import { JobRecomendationsController } from './job_recomendations.controller';
import { JobRecomendationsService } from '../services/job_recomendations.service';

describe('JobRecomendationsController', () => {
  let controller: JobRecomendationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobRecomendationsController],
      providers: [JobRecomendationsService],
    }).compile();

    controller = module.get<JobRecomendationsController>(JobRecomendationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
