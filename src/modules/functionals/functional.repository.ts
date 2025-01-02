import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Functional } from 'src/entities/functional.entity';

@Injectable()
export class FunctionalRepository {
  constructor(
    @InjectRepository(Functional)
    private readonly functionalRepository: Repository<Functional>,
  ) {}

  async findByIds(ids: number[]) {
    return await this.functionalRepository.findBy({ id: In(ids) });
  }
}
