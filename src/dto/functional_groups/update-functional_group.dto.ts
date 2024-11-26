import { PartialType } from '@nestjs/swagger';
import { CreateFunctionalGroupDto } from './create-functional_group.dto';

export class UpdateFunctionalGroupDto extends PartialType(CreateFunctionalGroupDto) {}
