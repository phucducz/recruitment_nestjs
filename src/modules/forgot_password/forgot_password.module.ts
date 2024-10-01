import { Module } from '@nestjs/common';
import { ForgotPasswordService } from 'src/services/forgot_password.service';

@Module({
  providers: [ForgotPasswordService],
  exports: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
