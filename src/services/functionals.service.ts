import { Injectable } from '@nestjs/common';

import { CreateFunctionalDto } from 'src/dto/functionals/create-functional.dto';
import { UpdateFunctionalDto } from 'src/dto/functionals/update-functional.dto';

@Injectable()
export class FunctionalsService {
  create(createFunctionalDto: CreateFunctionalDto) {
    return 'This action adds a new functional';
  }

  findAll() {
    return `This action returns all functionals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} functional`;
  }

  update(id: number, updateFunctionalDto: UpdateFunctionalDto) {
    return `This action updates a #${id} functional`;
  }

  remove(id: number) {
    return `This action removes a #${id} functional`;
  }
}
