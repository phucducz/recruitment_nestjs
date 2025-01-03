import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from 'src/entities/role.entity';
import { RolesService } from '../../services/roles.service';
import { AuthModule } from '../auth/auth.module';
import { FunctionalsModule } from '../functionals/functionals.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    FunctionalsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
