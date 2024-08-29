import { Test, TestingModule } from '@nestjs/testing';
import { UsersForeignLanguagesService } from '../../services/users_foreign_languages.service';

describe('UsersForeignLanguagesService', () => {
  let service: UsersForeignLanguagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersForeignLanguagesService],
    }).compile();

    service = module.get<UsersForeignLanguagesService>(UsersForeignLanguagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
