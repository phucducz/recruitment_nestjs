import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FunctionalGroup } from 'src/entities/functional_group.entity';

@Injectable()
export class FunctionalGroupRepository {
  constructor(
    @InjectRepository(FunctionalGroup)
    private readonly functionalGroupRepository: Repository<FunctionalGroup>,
  ) {}
}
