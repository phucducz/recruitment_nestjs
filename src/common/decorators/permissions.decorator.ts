import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from '../utils/enums';

export const Permissions = (...permissions: PERMISSION[]) =>
  SetMetadata('permissions', permissions);
