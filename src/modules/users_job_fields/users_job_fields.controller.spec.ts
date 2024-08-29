import { Test, TestingModule } from '@nestjs/testing';
import { UsersJobFieldsController } from './users_job_fields.controller';
import { UsersJobFieldsService } from '../../services/users_job_fields.service';

describe('UsersJobFieldsController', () => {
  let controller: UsersJobFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersJobFieldsController],
      providers: [UsersJobFieldsService],
    }).compile();

    controller = module.get<UsersJobFieldsController>(UsersJobFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
