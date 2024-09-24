import { OmitType } from '@nestjs/mapped-types';
import { CreateUsersForeignLanguageDto } from './create-users_foreign_language.dto';

export class UpdateUsersForeignLanguageDto extends OmitType(
  CreateUsersForeignLanguageDto,
  ['foreignLanguagesId'],
) {}
