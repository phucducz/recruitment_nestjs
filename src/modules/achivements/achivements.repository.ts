import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAchivementDto } from 'src/dto/achivements/create-achivement.dto';
import { UpdateAchivementDto } from 'src/dto/achivements/update-achivement.dto';
import { Achivement } from 'src/entities/achivement.entity';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class AchivementsRepository {
  constructor(
    @InjectRepository(Achivement)
    private readonly achivementRepository: Repository<Achivement>,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async create(createAchivementDto: ICreate<CreateAchivementDto>) {
    const { createBy, variable } = createAchivementDto;

    return await this.achivementRepository.save({
      createAt: new Date().toString(),
      createBy,
      description: variable.description,
      user: await this.userService.findById(createBy),
    });
  }

  async update(id: number, updateAchivementDto: IUpdate<UpdateAchivementDto>) {
    const { updateBy, variable } = updateAchivementDto;

    const { affected } = await this.achivementRepository.update(id, {
      description: variable.description,
      updateAt: new Date().toString(),
      updateBy,
    });

    return affected > 0;
  }
}
