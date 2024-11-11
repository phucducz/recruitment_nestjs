import { Injectable } from '@nestjs/common';

import { CreateApplicationStatusDto } from 'src/dto/application_status/create-application_status.dto';
import { UpdateApplicationStatusDto } from 'src/dto/application_status/update-application_status.dto';

@Injectable()
export class ApplicationStatusService {
  create(createApplicationStatusDto: CreateApplicationStatusDto) {
    return 'This action adds a new applicationStatus';
  }

  findAll() {
    return `This action returns all applicationStatus`;
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
