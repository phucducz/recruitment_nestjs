import { Inject, Injectable } from '@nestjs/common';
import { CreateWorkTypeDto } from 'src/dto/work_types/create-work_type.dto';

import { UpdateWorkTypeDto } from 'src/dto/work_types/update-work_type.dto';
import { WorkTypesRepository } from 'src/modules/work_types/work_types.repository';

@Injectable()
export class WorkTypesService {
  constructor(
    @Inject(WorkTypesRepository)
    private readonly workTypeRepository: WorkTypesRepository,
  ) {}

  async create(createWorkType: ICreate<CreateWorkTypeDto>) {
    return await this.workTypeRepository.create(createWorkType);
  }

  async createMany(createManyWorkTypes: ICreateMany<CreateWorkTypeDto>) {
    return await this.workTypeRepository.createMany(createManyWorkTypes);
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
