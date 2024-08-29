import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersJobDto } from './create-users_job.dto';

export class UpdateUsersJobDto extends PartialType(CreateUsersJobDto) {}
