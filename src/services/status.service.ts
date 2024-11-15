import { Inject, Injectable } from '@nestjs/common';

import { STATUS_TITLES } from 'src/common/utils/enums';
import { CreateStatusDto } from 'src/dto/status/create-status.dto';
import { UpdateStatusDto } from 'src/dto/status/update-status.dto';
import { StatusRepository } from 'src/modules/status/status.repository';

@Injectable()
export class StatusService {
  constructor(
    @Inject(StatusRepository)
    private readonly statusRepository: StatusRepository,
  ) {}

  create(createStatusDto: CreateStatusDto) {
    return 'This action adds a new status';
  }

  async findByTitle(title: STATUS_TITLES, statusTypesId: number) {
    return await this.statusRepository.findByTitle(title, statusTypesId);
  }

  async findById(id: number) {
    return await this.statusRepository.findById(id);
  }

  findAll() {
    return `This action returns all status`;
  }

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateStatusDto: UpdateStatusDto) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
