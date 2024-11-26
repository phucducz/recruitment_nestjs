import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Functional } from 'src/entities/functional.entity';
import { FunctionalsService } from 'src/services/functionals.service';
import { FunctionalRepository } from './functional.repository';
import { FunctionalsController } from './functionals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Functional])],
  controllers: [FunctionalsController],
  providers: [FunctionalsService, FunctionalRepository],
  exports: [FunctionalsService, FunctionalRepository],
})
export class FunctionalsModule {}
