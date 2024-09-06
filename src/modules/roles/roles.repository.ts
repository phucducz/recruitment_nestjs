import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async findById(id: number) {
    const queryBuilder = this.rolesRepository
      .createQueryBuilder('r')
      .select('r')
      .where(`r.id = ${id}`);
    return (await queryBuilder.getRawOne()) as Role;
  }

  async findByTitle(title: string) {
    const queryBuilder = this.rolesRepository
      .createQueryBuilder('r')
      .select('r')
      .where('r.title = :title', { title });

    return (await queryBuilder.getRawOne()) as Role;
  }
}
