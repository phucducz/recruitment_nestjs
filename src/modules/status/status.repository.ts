import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Status } from 'src/entities/status.entity';

@Injectable()
export class StatusRepository {
  constructor(
    @Inject(Status) private readonly statusRepository: Repository<Status>,
  ) {}
}
