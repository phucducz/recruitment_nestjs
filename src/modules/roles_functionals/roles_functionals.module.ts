import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { RolesFunctionalsService } from 'src/services/roles_functionals.service';
import { RolesFunctionalRepository } from './roles_functional.repository';
import { RolesFunctionalsController } from './roles_functionals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RolesFunctional])],
  controllers: [RolesFunctionalsController],
  providers: [RolesFunctionalsService, RolesFunctionalRepository],
  exports: [RolesFunctionalsService, RolesFunctionalRepository],
})
export class RolesFunctionalsModule {}
