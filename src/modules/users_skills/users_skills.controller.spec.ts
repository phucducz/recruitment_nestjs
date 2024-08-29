import { Test, TestingModule } from '@nestjs/testing';
import { UsersSkillsController } from './users_skills.controller';
import { UsersSkillsService } from './users_skills.service';

describe('UsersSkillsController', () => {
  let controller: UsersSkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersSkillsController],
      providers: [UsersSkillsService],
    }).compile();

    controller = module.get<UsersSkillsController>(UsersSkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
