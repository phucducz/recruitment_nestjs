import { Injectable } from '@nestjs/common';

import { CreateFunctionalGroupDto } from 'src/dto/functional_groups/create-functional_group.dto';
import { UpdateFunctionalGroupDto } from 'src/dto/functional_groups/update-functional_group.dto';

@Injectable()
export class FunctionalGroupsService {
  create(createFunctionalGroupDto: CreateFunctionalGroupDto) {
    return 'This action adds a new functionalGroup';
  }

  findAll() {
    return `This action returns all functionalGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} functionalGroup`;
  }

  update(id: number, updateFunctionalGroupDto: UpdateFunctionalGroupDto) {
    return `This action updates a #${id} functionalGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} functionalGroup`;
  }
}
