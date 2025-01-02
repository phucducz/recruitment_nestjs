import { Inject, Injectable } from '@nestjs/common';

import { CreateFunctionalDto } from 'src/dto/functionals/create-functional.dto';
import { UpdateFunctionalDto } from 'src/dto/functionals/update-functional.dto';
import { FunctionalRepository } from 'src/modules/functionals/functional.repository';

@Injectable()
export class FunctionalsService {
  constructor(
    @Inject() private readonly functionalRepository: FunctionalRepository,
  ) {}

  async create(createFunctionalDto: ICreate<CreateFunctionalDto>) {
    return await this.functionalRepository.create(createFunctionalDto);
  }

  async findAll(functionalQueries: FunctionalQueries) {
    return await this.functionalRepository.findAll(functionalQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} functional`;
  }

  update(id: number, updateFunctionalDto: UpdateFunctionalDto) {
    console.log(updateFunctionalDto);
    return `This action updates a #${id} functional`;
  }

  remove(id: number) {
    return `This action removes a #${id} functional`;
  }
}
