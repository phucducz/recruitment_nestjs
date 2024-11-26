import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolesFunctional } from 'src/entities/roles_functional.entity';

@Injectable()
export class RolesFunctionalRepository {
  constructor(
    @InjectRepository(RolesFunctional)
    private readonly rolesFunctionalRepository: Repository<RolesFunctional>,
  ) {}
}
