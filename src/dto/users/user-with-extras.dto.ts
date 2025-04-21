import { DesiredJob } from 'src/entities/desired_job.entity';
import { User } from 'src/entities/user.entity';
import {
  MenuViewDto,
  MenuViewGroupDto,
} from '../menu_view_groups/get-menu_view_group.dto';

export class UserWithExtrasDto extends User {
  desiredJob: DesiredJob;
  functionals: string[];
  viewGroups: MenuViewGroupDto[];
  standaloneViews: MenuViewDto[];
}
