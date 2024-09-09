import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersJobFieldRepository {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @InjectRepository(UsersJobField)
    private readonly usersJobFieldRepository: Repository<UsersJobField>,
  ) {
    usersJobFieldRepository = this.dataSource.getRepository(UsersJobField);
  }
}
