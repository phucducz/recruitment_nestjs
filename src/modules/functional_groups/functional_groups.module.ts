import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FunctionalGroup } from 'src/entities/functional_group.entity';
import { FunctionalGroupsService } from 'src/services/functional_groups.service';
import { FunctionalGroupsController } from './functional_groups.controller';
import { FunctionalGroupRepository } from './functional_groups.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FunctionalGroup])],
  controllers: [FunctionalGroupsController],
  providers: [FunctionalGroupsService, FunctionalGroupRepository],
  exports: [FunctionalGroupsService, FunctionalGroupRepository],
})
export class FunctionalGroupsModule {}
