import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FunctionalGroup } from 'src/entities/functional_group.entity';
import { FunctionalGroupsService } from 'src/services/functional_groups.service';
import { AuthModule } from '../auth/auth.module';
import { FunctionalsModule } from '../functionals/functionals.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { FunctionalGroupsController } from './functional_groups.controller';
import { FunctionalGroupRepository } from './functional_groups.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FunctionalGroup]),
    FunctionalsModule,
    RefreshTokenModule,
    AuthModule,
  ],
  controllers: [FunctionalGroupsController],
  providers: [FunctionalGroupsService, FunctionalGroupRepository],
  exports: [FunctionalGroupsService, FunctionalGroupRepository],
})
export class FunctionalGroupsModule {}
