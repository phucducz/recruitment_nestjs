import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Status } from 'src/entities/status.entity';
import { StatusController } from './status.controller';
import { StatusRepository } from './status.repository';
import { StatusService } from '../../services/status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusController],
  providers: [StatusService, StatusRepository],
  exports: [StatusService, StatusRepository],
})
export class StatusModule {}
