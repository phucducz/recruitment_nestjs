import { Test, TestingModule } from '@nestjs/testing';
import { ForeignLanguagesController } from './foreign_languages.controller';
import { ForeignLanguagesService } from '../../services/foreign_languages.service';

describe('ForeignLanguagesController', () => {
  let controller: ForeignLanguagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForeignLanguagesController],
      providers: [ForeignLanguagesService],
    }).compile();

    controller = module.get<ForeignLanguagesController>(ForeignLanguagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
