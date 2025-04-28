import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuViewGroup } from 'src/entities/menu_view_group.entity';
import { MenuViews } from 'src/entities/menu_views.entity';
import { MenuViewGroupsService } from '../../services/menu_view_groups.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';
import { MenuViewGroupsController } from './menu_view_groups.controller';
import { MenuViewGroupRepository } from './menu_view_groups.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuViewGroup]),
    MenuViews,
    forwardRef(() => AuthModule),
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [MenuViewGroupsController],
  providers: [MenuViewGroupsService, MenuViewGroupRepository],
  exports: [MenuViewGroupsService, MenuViewGroupRepository],
})
export class MenuViewGroupsModule {}
