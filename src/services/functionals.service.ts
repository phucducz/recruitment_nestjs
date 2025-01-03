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

  async update(id: number, updateFunctionalDto: IUpdate<UpdateFunctionalDto>) {
    return await this.functionalRepository.update(id, updateFunctionalDto);
  }

  async remove(id: number) {
    return await this.functionalRepository.remove(id);
  }
}
