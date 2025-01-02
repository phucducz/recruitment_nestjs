import { Inject, Injectable } from '@nestjs/common';

import { CreateFunctionalGroupDto } from 'src/dto/functional_groups/create-functional_group.dto';
import { UpdateFunctionalGroupDto } from 'src/dto/functional_groups/update-functional_group.dto';
import { FunctionalGroupRepository } from 'src/modules/functional_groups/functional_groups.repository';
import { FunctionalRepository } from 'src/modules/functionals/functional.repository';

@Injectable()
export class FunctionalGroupsService {
  constructor(
    @Inject()
    private readonly functionalGroupRepository: FunctionalGroupRepository,
    @Inject() private readonly functionalRepository: FunctionalRepository,
  ) {}

  async create(createFunctionalGroupDto: ICreate<CreateFunctionalGroupDto>) {
    const { variable } = createFunctionalGroupDto;

    return await this.functionalGroupRepository.create({
      ...createFunctionalGroupDto,
      variable: {
        ...variable,
        functionals: await this.functionalRepository.findByIds(
          variable.functionalIds,
        ),
      },
    });
  }

  async findAll(functionalGroupQueries: FunctionalGroupQueries) {
    return await this.functionalGroupRepository.findAll(functionalGroupQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} functionalGroup`;
  }

  async update(
    id: number,
    updateFunctionalGroupDto: IUpdate<UpdateFunctionalGroupDto>,
  ) {
    const { variable } = updateFunctionalGroupDto;

    return await this.functionalGroupRepository.update(id, {
      ...updateFunctionalGroupDto,
      variable: {
        ...variable,
        functionals: await this.functionalRepository.findByIds(
          variable.functionalIds,
        ),
        storedFunctionals: await this.functionalRepository.find({
          where: { functionalGroup: { id } },
        }),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} functionalGroup`;
  }
}
