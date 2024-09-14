import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreatePlacementDto } from 'src/dto/placements/create-placement.dto';
import { Placement } from 'src/entities/placement.entity';

@Injectable()
export class PlacementsRepository {
  constructor(
    @InjectRepository(Placement)
    private readonly placementRepository: Repository<Placement>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async createMany(createManyPlacement: ICreateMany<CreatePlacementDto>) {
    const { createBy, variables } = createManyPlacement;

    console.log(variables);

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) =>
        await Promise.all(
          variables.map(async (variable) =>
            transactionalEntityManager.save(
              Placement,
              this.placementRepository.create({
                createAt: new Date().toString(),
                createBy: createBy,
                title: variable.title,
              }),
            ),
          ),
        ),
    );
  }

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
