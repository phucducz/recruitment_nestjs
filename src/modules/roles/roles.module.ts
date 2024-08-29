import { Module } from '@nestjs/common';
import { RolesService } from '../../services/roles.service';
import { RolesController } from './roles.controller';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
