import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateAchivementDto } from './create-achivement.dto';

export class UpdateAchivementDto extends PartialType(CreateAchivementDto) {
  @IsString()
  @IsNotEmpty()
  description?: string;
}
