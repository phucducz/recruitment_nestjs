import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Skill } from 'src/entities/skill.entity';
import { SkillsService } from '../../services/skills.service';
import { SkillsController } from './skills.controller';
import { SkillsRepository } from './skills.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillsController],
  providers: [SkillsService, SkillsRepository],
  exports: [SkillsService],
})
export class SkillsModule {}
