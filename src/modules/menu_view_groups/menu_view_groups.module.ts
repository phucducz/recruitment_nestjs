import { Module } from '@nestjs/common';
import { MenuViewGroupsService } from './menu_view_groups.service';
import { MenuViewGroupsController } from './menu_view_groups.controller';

@Module({
  controllers: [MenuViewGroupsController],
  providers: [MenuViewGroupsService],
})
export class MenuViewGroupsModule {}
