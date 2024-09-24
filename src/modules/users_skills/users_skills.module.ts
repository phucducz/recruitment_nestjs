import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersSkill } from 'src/entities/users_skill.entity';
import { UsersSkillsService } from '../../services/users_skills.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { SkillsModule } from '../skills/skills.module';
import { UsersModule } from '../users/users.module';
import { UsersSkillsController } from './users_skills.controller';
import { UsersSkillsRepository } from './users_skills.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersSkill]),
    SkillsModule,
    UsersModule,
    RefreshTokenModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersSkillsController],
  providers: [UsersSkillsService, UsersSkillsRepository],
  exports: [UsersSkillsService],
})
export class UsersSkillsModule {}
