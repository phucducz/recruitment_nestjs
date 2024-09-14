import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Placement } from 'src/entities/placement.entity';

@Injectable()
export class PlacementsRepository {
  constructor(
    @InjectRepository(Placement)
    private readonly placementRepository: Repository<Placement>,
  ) {}

  async findById(id: number) {
    return this.placementRepository.findOne({ where: { id: id } });
  }

  async findByIds(ids: number[]) {
    return await Promise.all(ids.map(async (id) => await this.findById(id)));
  }

  async findAll() {
    return await this.placementRepository.find();
  }
}
