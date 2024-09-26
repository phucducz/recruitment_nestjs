import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomUnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
