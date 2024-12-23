import { Inject, Injectable } from '@nestjs/common';

import { CreateAchivementDto } from 'src/dto/achivements/create-achivement.dto';
import { UpdateAchivementDto } from 'src/dto/achivements/update-achivement.dto';
import { AchivementsRepository } from 'src/modules/achivements/achivements.repository';
import { UsersService } from './users.service';

@Injectable()
export class AchivementsService {
  constructor(
    @Inject(AchivementsRepository)
    private readonly achivementRepository: AchivementsRepository,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async create(createAchivementDto: ICreate<CreateAchivementDto>) {
    const { createBy, variable } = createAchivementDto;

    return await this.achivementRepository.create({
      ...createAchivementDto,
      variable: {
        ...variable,
        user: await this.userService.findById(createBy),
      },
    });
  }

  findAll() {
    return `This action returns all achivements`;
  }

  async findById(id: number) {
    return await this.achivementRepository.findById(id);
  }

  async findOne(userId: number) {
    return await this.achivementRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async update(id: number, updateAchivementDto: IUpdate<UpdateAchivementDto>) {
    return await this.achivementRepository.update(id, updateAchivementDto);
  }

  async remove(userId: number, id: number) {
    const result = await this.userService.deleteAchivement(userId);

    if (!result) return false;

    return await this.achivementRepository.delete(id);
  }
}
