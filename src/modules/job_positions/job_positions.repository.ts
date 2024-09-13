import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateJobPositionDto } from 'src/dto/job_positions/create-job_position.dto';
import { JobPosition } from 'src/entities/job_position.entity';

@Injectable()
export class JobPositionsRepository {
  constructor(
    @InjectRepository(JobPosition)
    private readonly jobPositionRepository: Repository<JobPosition>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.jobPositionRepository.find();
  }

  async findById(id: number): Promise<JobPosition> {
    return await this.jobPositionRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(createJobPosition: ICreate<CreateJobPositionDto>) {
    const { createBy, variable } = createJobPosition;

    return this.jobPositionRepository.save({
      createAt: new Date().toString(),
      createBy: createBy,
      title: variable.title,
    });
  }

  async createMany(createJobPositions: ICreateMany<CreateJobPositionDto>) {
    const { createBy, variables } = createJobPositions;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await Promise.all(
          variables.map(async (jobPosition) => {
            return (await transactionalEntityManager.save(JobPosition, {
              createAt: new Date().toString(),
              createBy: createBy,
              title: jobPosition.title,
            })) as JobPosition;
          }),
        );
      },
    );
  }
}
