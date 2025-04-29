import { PartialType } from '@nestjs/swagger';
import { CreateMenuViewGroupDto } from './create-menu_view_group.dto';

export class UpdateMenuViewGroupDto extends PartialType(
  CreateMenuViewGroupDto,
) {}
