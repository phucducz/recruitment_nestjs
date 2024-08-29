import { Test, TestingModule } from '@nestjs/testing';
import { UsersForeignLanguagesController } from './users_foreign_languages.controller';
import { UsersForeignLanguagesService } from '../../services/users_foreign_languages.service';

describe('UsersForeignLanguagesController', () => {
  let controller: UsersForeignLanguagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersForeignLanguagesController],
      providers: [UsersForeignLanguagesService],
    }).compile();

    controller = module.get<UsersForeignLanguagesController>(UsersForeignLanguagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
