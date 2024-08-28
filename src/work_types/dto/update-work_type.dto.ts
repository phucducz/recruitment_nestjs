import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkTypeDto } from './create-work_type.dto';

export class UpdateWorkTypeDto extends PartialType(CreateWorkTypeDto) {}
