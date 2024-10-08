import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkType } from 'src/entities/work_type.entity';
import { WorkTypesService } from '../../services/work_types.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { WorkTypesController } from './work_types.controller';
import { WorkTypesRepository } from './work_types.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkType]),
    AuthModule,
    RefreshTokenModule,
  ],
  controllers: [WorkTypesController],
  providers: [WorkTypesService, WorkTypesRepository],
  exports: [WorkTypesService],
})
export class WorkTypesModule {}
