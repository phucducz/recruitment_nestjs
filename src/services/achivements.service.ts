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

  findOne(id: number) {
    return `This action returns a #${id} achivement`;
  }

  update(id: number, updateAchivementDto: UpdateAchivementDto) {
    return `This action updates a #${id} achivement`;
  }

  remove(id: number) {
    return `This action removes a #${id} achivement`;
  }
}
