import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurriculumVitae } from 'src/entities/curriculum_vitae';
import { CurriculumVitaesService } from 'src/services/curriculum_vitaes.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersModule } from '../users/users.module';
import { CurriculumVitaesRepository } from './curriculum_vitae.repository';
import { CurriculumVitaesController } from './curriculum_vitaes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurriculumVitae]),
    forwardRef(() => UsersModule),
    forwardRef(() => RefreshTokenModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [CurriculumVitaesController],
  providers: [CurriculumVitaesService, CurriculumVitaesRepository],
  exports: [CurriculumVitaesService],
})
export class CurriculumVitaesModule {}
