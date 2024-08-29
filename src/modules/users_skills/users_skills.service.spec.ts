import { Test, TestingModule } from '@nestjs/testing';
import { UsersSkillsService } from '../../services/users_skills.service';

describe('UsersSkillsService', () => {
  let service: UsersSkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersSkillsService],
    }).compile();

    service = module.get<UsersSkillsService>(UsersSkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
