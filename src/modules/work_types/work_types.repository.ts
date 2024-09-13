import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateWorkTypeDto } from 'src/dto/work_types/create-work_type.dto';
import { WorkType } from 'src/entities/work_type.entity';

@Injectable()
export class WorkTypesRepository {
  constructor(
    @InjectRepository(WorkType)
    private readonly workTypeRepository: Repository<WorkType>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.workTypeRepository.find();
  }

  async findById(id: number) {
    return await this.workTypeRepository.findOne({ where: { id: id } });
  }

  async create(createWorkType: ICreate<CreateWorkTypeDto>): Promise<WorkType> {
    const { createBy, variable } = createWorkType;

    return await this.workTypeRepository.save({
      createAt: new Date().toString(),
      createBy: createBy,
      title: variable.title,
    });
  }

  async createMany(createManyWorkTypes: ICreateMany<CreateWorkTypeDto>) {
    const { createBy, variables } = createManyWorkTypes;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await Promise.all(
          variables.map(async (workType) => {
            return (await transactionalEntityManager.save(WorkType, {
              createAt: new Date().toString(),
              createBy: createBy,
              title: workType.title,
            })) as WorkType;
          }),
        );
      },
    );
  }
}
