import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/entities/status.entity';

@Injectable()
export class StatusRepository {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async findByTitle(title: string, statusTypesId: number) {
    return await this.statusRepository.findOneBy({
      title,
      statusType: { id: statusTypesId },
    });
  }

  async findById(id: number) {
    return await this.statusRepository.findOneBy({ id });
  }
}
