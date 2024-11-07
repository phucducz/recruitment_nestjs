import { Inject, Injectable } from '@nestjs/common';

import { CreateAchivementDto } from 'src/dto/achivements/create-achivement.dto';
import { UpdateAchivementDto } from 'src/dto/achivements/update-achivement.dto';
import { AchivementsRepository } from 'src/modules/achivements/achivements.repository';

@Injectable()
export class AchivementsService {
  constructor(
    @Inject(AchivementsRepository)
    private readonly achivementRepository: AchivementsRepository,
  ) {}

  async create(createAchivementDto: ICreate<CreateAchivementDto>) {
    return await this.achivementRepository.create(createAchivementDto);
  }

  findAll() {
    return `This action returns all achivements`;
  }

  async findById(id: number) {
    return await this.achivementRepository.findById(id);
  }

  async update(id: number, updateAchivementDto: IUpdate<UpdateAchivementDto>) {
    return await this.achivementRepository.update(id, updateAchivementDto);
  }

  remove(id: number) {
    return `This action removes a #${id} achivement`;
  }
}
