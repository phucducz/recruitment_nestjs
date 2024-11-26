import { PartialType } from '@nestjs/swagger';
import { CreateFunctionalDto } from './create-functional.dto';

export class UpdateFunctionalDto extends PartialType(CreateFunctionalDto) {}
