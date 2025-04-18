import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { RedisService } from '../../services/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolesFunctional])],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
