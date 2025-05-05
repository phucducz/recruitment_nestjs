import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from '../utils/enums';

interface IPermissionProps {
  match: 'all' | 'any';
  permissions: PERMISSION[];
}

export type IPermission = IPermissionProps | PERMISSION[];

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (permission: IPermission) =>
  SetMetadata(PERMISSIONS_KEY, permission);
