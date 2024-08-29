import { Injectable } from '@nestjs/common';

import { CreateWorkTypeDto } from 'src/dto/work_types/create-work_type.dto';
import { UpdateWorkTypeDto } from 'src/dto/work_types/update-work_type.dto';

@Injectable()
export class WorkTypesService {
  create(createWorkTypeDto: CreateWorkTypeDto) {
    return 'This action adds a new workType';
  }

  findAll() {
    return `This action returns all workTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workType`;
  }

  update(id: number, updateWorkTypeDto: UpdateWorkTypeDto) {
    return `This action updates a #${id} workType`;
  }

  remove(id: number) {
    return `This action removes a #${id} workType`;
  }
}
