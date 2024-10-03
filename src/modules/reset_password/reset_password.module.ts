import { Module } from '@nestjs/common';

import { ResetPasswordService } from 'src/services/forgot_password.service';

@Module({
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
