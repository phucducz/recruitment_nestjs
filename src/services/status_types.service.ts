import { Inject, Injectable } from '@nestjs/common';

import { STATUS_TYPE_TITLES } from 'src/common/utils/enums';
import { CreateStatusTypeDto } from 'src/dto/status_types/create-status_type.dto';
import { UpdateStatusTypeDto } from 'src/dto/status_types/update-status_type.dto';
import { StatusTypeRepository } from 'src/modules/status_types/status_types.repository';

@Injectable()
export class StatusTypesService {
  constructor(
    @Inject(StatusTypeRepository)
    private readonly statusTypeRepository: StatusTypeRepository,
  ) {}

  create(createStatusTypeDto: CreateStatusTypeDto) {
    return 'This action adds a new statusType';
  }

  findAll() {
    return `This action returns all statusTypes`;
  }

  async findByTitle(title: STATUS_TYPE_TITLES) {
    return await this.statusTypeRepository.findByTitle(title);
  }

  findOne(id: number) {
    return `This action returns a #${id} statusType`;
  }

  update(id: number, updateStatusTypeDto: UpdateStatusTypeDto) {
    return `This action updates a #${id} statusType`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusType`;
  }
}
