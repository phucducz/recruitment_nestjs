import { DesiredJob } from 'src/entities/desired_job.entity';
import { MenuViewGroup } from 'src/entities/menu_view_group.entity';
import { User } from 'src/entities/user.entity';

export class UserWithExtrasDto extends User {
  desiredJob: DesiredJob;
  viewGroups: MenuViewGroup[];
}
