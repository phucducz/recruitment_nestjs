import { DesiredJob } from 'src/entities/desired_job.entity';
import { Functional } from 'src/entities/functional.entity';
import { User } from 'src/entities/user.entity';

export class UserWithExtrasDto extends User {
  functionals: Functional[];
  desiredJob: DesiredJob;
}
