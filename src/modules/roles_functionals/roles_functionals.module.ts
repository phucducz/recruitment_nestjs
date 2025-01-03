import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { RolesFunctionalsService } from 'src/services/roles_functionals.service';
import { AuthModule } from '../auth/auth.module';
import { FunctionalsModule } from '../functionals/functionals.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { RolesModule } from '../roles/roles.module';
import { RolesFunctionalRepository } from './roles_functional.repository';
import { RolesFunctionalsController } from './roles_functionals.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolesFunctional]),
    AuthModule,
    RolesModule,
    FunctionalsModule,
    RefreshTokenModule,
  ],
  controllers: [RolesFunctionalsController],
  providers: [RolesFunctionalsService, RolesFunctionalRepository],
  exports: [RolesFunctionalsService, RolesFunctionalRepository],
})
export class RolesFunctionalsModule {}
