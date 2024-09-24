import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsRepository {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async findById(id: number) {
    return await this.skillRepository.findOneBy({ id });
  }
}
