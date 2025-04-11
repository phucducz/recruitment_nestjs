import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Functional } from 'src/entities/functional.entity';
import { FunctionalsService } from 'src/services/functionals.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { FunctionalRepository } from './functional.repository';
import { FunctionalsController } from './functionals.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Functional]),
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [FunctionalsController],
  providers: [FunctionalsService, FunctionalRepository],
  exports: [FunctionalsService, FunctionalRepository],
})
export class FunctionalsModule {}
