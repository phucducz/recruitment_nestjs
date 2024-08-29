import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersJobFieldDto } from './create-users_job_field.dto';

export class UpdateUsersJobFieldDto extends PartialType(CreateUsersJobFieldDto) {}
