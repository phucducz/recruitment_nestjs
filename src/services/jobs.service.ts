import { Inject, Injectable } from '@nestjs/common';

import { CreateJobDto } from 'src/dto/jobs/create-job.dto';
import { UpdateJobDto } from 'src/dto/jobs/update-job.dto';
import { JobsRepository } from 'src/modules/jobs/jobs.repository';

@Injectable()
export class JobsService {
  constructor(
    @Inject(JobsRepository) private readonly jobRepository: JobsRepository,
  ) {}

  async create(createJob: ICreate<CreateJobDto>) {
    return this.jobRepository.create(createJob);
  }

  async findAll() {
    return await this.jobRepository.findAll();
  }

  async findById(id: number) {
    return await this.jobRepository.findById(id);
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
