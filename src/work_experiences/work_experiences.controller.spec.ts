import { Test, TestingModule } from '@nestjs/testing';
import { WorkExperiencesController } from './work_experiences.controller';
import { WorkExperiencesService } from './work_experiences.service';

describe('WorkExperiencesController', () => {
  let controller: WorkExperiencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkExperiencesController],
      providers: [WorkExperiencesService],
    }).compile();

    controller = module.get<WorkExperiencesController>(WorkExperiencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
