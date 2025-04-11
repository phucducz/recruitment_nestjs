import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatusType } from 'src/entities/status_type.entity';
import { StatusTypesService } from 'src/services/status_types.service';
import { StatusTypesController } from './status_types.controller';
import { StatusTypeRepository } from './status_types.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StatusType])],
  controllers: [StatusTypesController],
  providers: [StatusTypesService, StatusTypeRepository],
  exports: [StatusTypesService, StatusTypeRepository],
})
export class StatusTypesModule {}
