import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { UNAUTHORIZED_EXCEPTION_MESSAGE } from '../utils/enums';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(401).json({
      statusCode: 401,
      message: exception.message || 'Unauthorized',
      ...(exception.message ===
        UNAUTHORIZED_EXCEPTION_MESSAGE.TOKEN_EXPIRED && {
        action: 'REFRESH_TOKEN',
      }),
    });
  }
}
