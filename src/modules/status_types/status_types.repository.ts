import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from 'src/entities/status_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusTypeRepository {
  constructor(
    @InjectRepository(StatusType)
    private readonly statusTypeRepository: Repository<StatusType>,
  ) {}

  async findByTitle(title: string) {
    return this.statusTypeRepository.findOneBy({ title });
  }
}
