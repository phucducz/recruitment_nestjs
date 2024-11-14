import { RegisterDto } from 'src/dto/auth/register.dto';
import { JobPosition } from 'src/entities/job_position.entity';
import { Role } from 'src/entities/role.entity';

interface ISaveUserParams extends RegisterDto {
  role?: Role;
  jobPosition?: JobPosition;
}
