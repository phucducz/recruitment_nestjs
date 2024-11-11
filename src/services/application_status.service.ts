import { Inject, Injectable } from '@nestjs/common';

import { CreateApplicationStatusDto } from 'src/dto/application_status/create-application_status.dto';
import { UpdateApplicationStatusDto } from 'src/dto/application_status/update-application_status.dto';
import { ApplicationStatusRepository } from 'src/modules/application_status/application_status.repository';

@Injectable()
export class ApplicationStatusService {
  constructor(
    @Inject(ApplicationStatusRepository)
    private readonly applicationStatusRepository: ApplicationStatusRepository,
  ) {}

  create(createApplicationStatusDto: CreateApplicationStatusDto) {
    return 'This action adds a new applicationStatus';
  }

  async findAll(findAllQueries: IFindApplicationStatusQueries) {
    return await this.applicationStatusRepository.findAll(findAllQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} applicationStatus`;
  }

  update(id: number, updateApplicationStatusDto: UpdateApplicationStatusDto) {
    return `This action updates a #${id} applicationStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicationStatus`;
  }
}
