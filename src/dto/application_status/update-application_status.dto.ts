import { PartialType } from '@nestjs/swagger';
import { CreateApplicationStatusDto } from './create-application_status.dto';

export class UpdateApplicationStatusDto extends PartialType(CreateApplicationStatusDto) {}
