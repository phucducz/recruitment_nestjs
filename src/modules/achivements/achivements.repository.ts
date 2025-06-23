import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository, UpdateResult } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns } from 'src/common/utils/function';
import { CreateAchivementDto } from 'src/dto/achivements/create-achivement.dto';
import { UpdateAchivementDto } from 'src/dto/achivements/update-achivement.dto';
import { Achivement } from 'src/entities/achivement.entity';

@Injectable()
export class AchivementsRepository {
  constructor(
    @InjectRepository(Achivement)
    private readonly achivementRepository: Repository<Achivement>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async create(
    createAchivementDto: ICreate<
      CreateAchivementDto & Pick<Achivement, 'user'>
    >,
  ) {
    const { createBy, variable } = createAchivementDto;

    return await this.achivementRepository.save({
      createAt: new Date().toString(),
      createBy,
      description: variable.description,
      user: variable.user,
    });
  }

  async update(id: number, updateAchivementDto: IUpdate<UpdateAchivementDto>) {
    const { updateBy, variable, transactionalEntityManager } =
      updateAchivementDto;

    const result = transactionalEntityManager
      ? await transactionalEntityManager.update(Achivement, id, {
          description: variable.description,
          updateAt: new Date().toString(),
          updateBy,
        })
      : await this.achivementRepository.update(id, {
          description: variable.description,
          updateAt: new Date().toString(),
          updateBy,
        });

    return result;
  }

  async findById(id: number) {
    return await this.achivementRepository.findOne({
      where: { id },
      select: filterColumns(ENTITIES.FIELDS.ACHIVEMENT, removeColumns),
    });
  }

  async findOne(options: FindOneOptions<Achivement>) {
    return await this.achivementRepository.findOne({
      select: filterColumns(ENTITIES.FIELDS.ACHIVEMENT, removeColumns),
      ...options,
    });
  }

  async delete(id: number) {
    return (await this.achivementRepository.delete(id)).affected > 0;
  }
}
