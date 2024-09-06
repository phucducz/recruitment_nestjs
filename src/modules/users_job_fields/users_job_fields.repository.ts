import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersJobField } from 'src/entities/users_job_field.entity';

@Injectable()
export class UsersJobFieldsRepository {
  constructor(
    @InjectRepository(UsersJobField)
    @InjectRepository(UsersJobField)
    private readonly usersJobFieldRepository: Repository<UsersJobField>,
  ) {}

  findByIds(ids: number[]) {
    const queryBuilder = this.usersJobFieldRepository.createQueryBuilder('u');
  }
}
