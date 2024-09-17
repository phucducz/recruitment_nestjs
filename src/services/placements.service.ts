import { Inject, Injectable } from '@nestjs/common';

import { CreatePlacementDto } from 'src/dto/placements/create-placement.dto';
import { UpdatePlacementDto } from 'src/dto/placements/update-placement.dto';
import { PlacementsRepository } from 'src/modules/placements/placements.repository';

@Injectable()
export class PlacementsService {
  constructor(
    @Inject(PlacementsRepository)
    private readonly placementsRepository: PlacementsRepository,
  ) {}

  create(createPlacementDto: CreatePlacementDto) {
    return 'This action adds a new placement';
  }

  async createMany(createManyPlacement: ICreateMany<CreatePlacementDto>) {
    return await this.placementsRepository.createMany(createManyPlacement);
  }

  async findById(id: number) {
    return await this.placementsRepository.findById(id);
  }

  async findByIds(ids: number[]) {
    return await this.placementsRepository.findByIds(ids);
  }

  async findAll(pagination: IPagination) {
    return await this.placementsRepository.findAll(pagination);
  }

  findOne(id: number) {
    return `This action returns a #${id} placement`;
  }

  update(id: number, updatePlacementDto: UpdatePlacementDto) {
    return `This action updates a #${id} placement`;
  }

  remove(id: number) {
    return `This action removes a #${id} placement`;
  }
}
