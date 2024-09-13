import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateJobFieldDto } from 'src/dto/job_fields/create-job_field.dto';
import { JobField } from 'src/entities/job_field.entity';

@Injectable()
export class JobFieldsRepository {
  constructor(
    @InjectRepository(JobField)
    private readonly jobFieldRepository: Repository<JobField>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.jobFieldRepository.find();
  }

  async findById(id: number) {
    return await this.jobFieldRepository.findOne({ where: { id: id } });
  }

  async findByIds(ids: number[]) {
    return await Promise.all(ids.map(async (id) => await this.findById(id)));
  }

  async create(createJobField: ICreate<CreateJobFieldDto>) {
    const { createBy, variable } = createJobField;

    return await this.jobFieldRepository.save({
      createAt: new Date().toString(),
      createBy: createBy,
      title: variable.title,
    });
  }

  async createMany(createManyJobFields: ICreateMany<CreateJobFieldDto>) {
    const { createBy, variables } = createManyJobFields;

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await Promise.all(
          variables.map(async (jobField) => {
            return (await transactionalEntityManager.save(JobField, {
              createAt: new Date().toString(),
              createBy: createBy,
              title: jobField.title,
            })) as JobField;
          }),
        );
      },
    );
  }
}
