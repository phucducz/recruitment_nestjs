import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationStatusController } from './application_status.controller';
import { ApplicationStatusService } from '../../services/application_status.service';

describe('ApplicationStatusController', () => {
  let controller: ApplicationStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationStatusController],
      providers: [ApplicationStatusService],
    }).compile();

    controller = module.get<ApplicationStatusController>(ApplicationStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
