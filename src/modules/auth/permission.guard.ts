import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

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
    const requiredPermissions = this.reflector.get<PERMISSION[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions || !requiredPermissions?.length) return true;

    const user = request.user;
    if (!user)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.NO_PROVIDED_TOKEN,
      );

    const userPermissions =
      await this.redisService.getFunctionalsFromCacheByRole(user.roleId);

    console.log('user', user);
    console.log('userPermissions', userPermissions);

    const hasPermission = requiredPermissions?.some((permission) =>
      userPermissions.includes(permission),
    );
    console.log('hasPermission', hasPermission);

    if (!hasPermission)
      throw new ForbiddenException(
        FORBIDDEN_EXCEPTION_MESSAGE.MISSING_PERMISSION,
      );

    return true;
  }
}
