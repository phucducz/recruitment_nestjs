import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { JobPosition } from 'src/entities/job_position.entity';

@Injectable()
export class JobPositionsRepository {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @InjectRepository(JobPosition)
    private readonly jobPositionRepository: Repository<JobPosition>,
  ) {}

  async findById(id: number): Promise<JobPosition> {
    const queryBuilder = this.jobPositionRepository
      .createQueryBuilder('jp')
      .select('jp')
      .where('jp.id = :id', { id });

    return (await queryBuilder.getRawOne()) as JobPosition;
  }
}
