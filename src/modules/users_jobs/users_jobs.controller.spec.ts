import { Test, TestingModule } from '@nestjs/testing';
import { UsersJobsController } from './users_jobs.controller';
import { UsersJobsService } from '../../services/users_jobs.service';

describe('UsersJobsController', () => {
  let controller: UsersJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersJobsController],
      providers: [UsersJobsService],
    }).compile();

    controller = module.get<UsersJobsController>(UsersJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
