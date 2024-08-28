import { Module } from '@nestjs/common';
import { WorkTypesService } from './work_types.service';
import { WorkTypesController } from './work_types.controller';

@Module({
  controllers: [WorkTypesController],
  providers: [WorkTypesService],
})
export class WorkTypesModule {}
