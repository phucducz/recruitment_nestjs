import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Achivement } from 'src/entities/achivement.entity';
import { AchivementsService } from '../../services/achivements.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { UsersModule } from '../users/users.module';
import { AchivementsController } from './achivements.controller';
import { AchivementsRepository } from './achivements.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achivement]),
    UsersModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [AchivementsController],
  providers: [AchivementsService, AchivementsRepository],
  exports: [AchivementsService],
})
export class AchivementsModule {}
