import { Injectable } from '@nestjs/common';

import { CreateStatusTypeDto } from 'src/dto/status_types/create-status_type.dto';
import { UpdateStatusTypeDto } from 'src/dto/status_types/update-status_type.dto';

@Injectable()
export class StatusTypesService {
  create(createStatusTypeDto: CreateStatusTypeDto) {
    return 'This action adds a new statusType';
  }

  findAll() {
    return `This action returns all statusTypes`;
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
