import { Inject, Injectable } from '@nestjs/common';

import { CreateSkillDto } from 'src/dto/skills/create-skill.dto';
import { UpdateSkillDto } from 'src/dto/skills/update-skill.dto';
import { SkillsRepository } from 'src/modules/skills/skills.repository';

@Injectable()
export class SkillsService {
  constructor(
    @Inject(SkillsRepository)
    private readonly skillsRepository: SkillsRepository,
  ) {}

  create(createSkillDto: CreateSkillDto) {
    return 'This action adds a new skill';
  }

  async findById(id: number) {
    return await this.skillsRepository.findById(id);
  }

  findAll() {
    return `This action returns all skills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
