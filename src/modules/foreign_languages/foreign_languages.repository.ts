import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForeignLanguage } from 'src/entities/foreign_language.entity';

@Injectable()
export class ForeignLanguagesRepository {
  constructor(
    @InjectRepository(ForeignLanguage)
    private readonly foreignLanguagesRepository: Repository<ForeignLanguage>,
  ) {}

  async findById(id: number) {
    return await this.foreignLanguagesRepository.findOneBy({ id });
  }
}
