import { Module } from '@nestjs/common';
import { UsersSkillsService } from './users_skills.service';
import { UsersSkillsController } from './users_skills.controller';

@Module({
  controllers: [UsersSkillsController],
  providers: [UsersSkillsService],
})
export class UsersSkillsModule {}
