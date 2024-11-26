import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Functional } from 'src/entities/functional.entity';

@Injectable()
export class FunctionalRepository {
  constructor(
    @InjectRepository(Functional)
    private readonly functionalRepository: Repository<Functional>,
  ) {}
}
