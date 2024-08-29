import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersForeignLanguageDto } from './create-users_foreign_language.dto';

export class UpdateUsersForeignLanguageDto extends PartialType(CreateUsersForeignLanguageDto) {}
