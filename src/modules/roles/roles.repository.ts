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
    return await this.rolesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByTitle(title: string) {
    return await this.rolesRepository.findOne({
      where: {
        title: title,
      },
    });
  }
}
