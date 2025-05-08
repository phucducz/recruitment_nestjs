import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  IPermission,
  PERMISSIONS_KEY,
} from 'src/common/decorators/permissions.decorator';
import {
  FORBIDDEN_EXCEPTION_MESSAGE,
  PERMISSION,
  UNAUTHORIZED_EXCEPTION_MESSAGE,
} from 'src/common/utils/enums';
import { RedisService } from 'src/services/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.get<IPermission>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (
      !requiredPermissions ||
      (Array.isArray(requiredPermissions) && !requiredPermissions?.length)
    )
      return true;

    let permissions: PERMISSION[];
    let match: 'all' | 'any' = 'all';

    if (Array.isArray(requiredPermissions)) permissions = requiredPermissions;
    else {
      match = requiredPermissions.match;
      permissions = requiredPermissions.permissions;
    }

    const user = request.user;
    if (!user)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.NO_PROVIDED_TOKEN,
      );

    const userPermissions =
      await this.redisService.getFunctionalsFromCacheByRole(user.roleId);

    const hasPermission =
      match === 'all'
        ? permissions?.every((p) => userPermissions.includes(p))
        : permissions?.some((p) => userPermissions.includes(p));

    if (!hasPermission)
      throw new ForbiddenException(
        FORBIDDEN_EXCEPTION_MESSAGE.MISSING_PERMISSION,
      );

    return true;
  }
}
