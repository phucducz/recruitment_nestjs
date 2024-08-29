import { PartialType } from '@nestjs/mapped-types';
import { CreateForeignLanguageDto } from './create-foreign_language.dto';

export class UpdateForeignLanguageDto extends PartialType(CreateForeignLanguageDto) {}
