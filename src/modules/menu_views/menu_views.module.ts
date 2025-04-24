import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuViews } from 'src/entities/menu_views.entity';
import { MenuViewsService } from '../../services/menu_views.service';
import { MenuViewsController } from './menu_views.controller';
import { MenuViewRepository } from './menu_views.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MenuViews])],
  controllers: [MenuViewsController],
  providers: [MenuViewsService, MenuViewRepository],
  exports: [MenuViewsService, MenuViewRepository],
})
export class MenuViewsModule {}
