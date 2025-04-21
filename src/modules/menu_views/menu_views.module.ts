import { Module } from '@nestjs/common';
import { MenuViewsController } from './menu_views.controller';
import { MenuViewsService } from './menu_views.service';

@Module({
  controllers: [MenuViewsController],
  providers: [MenuViewsService],
})
export class MenuViewsModule {}
