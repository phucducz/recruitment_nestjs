import { Inject, Injectable } from '@nestjs/common';

import {
  STATUS_TITLES,
  STATUS_TYPE_CODES,
  STATUS_TYPE_TITLES,
} from 'src/common/utils/enums';
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

  async findByType(type: STATUS_TYPE_TITLES) {
    return await this.statusRepository.findByType(type);
  }

  async findAll(findStatusQueries: IFindStatusQueries) {
    if (
      findStatusQueries.type &&
      !Object.values(STATUS_TYPE_CODES).includes(
        findStatusQueries.type as STATUS_TYPE_CODES,
      )
    )
      throw new Error(
        `Loại trạng thái không hợp lệ. Giá trị phải là một trong "${Object.values(STATUS_TYPE_CODES).join(', ')}"`,
      );

    return await this.statusRepository.findAll(findStatusQueries);
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
