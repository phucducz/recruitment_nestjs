import { PartialType } from '@nestjs/swagger';
import { CreateMenuViewsDto } from './create-menu_views.dto';

export class UpdateMenuViewsDto extends PartialType(CreateMenuViewsDto) {}
