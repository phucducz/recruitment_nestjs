import { Module } from '@nestjs/common';

import { OTPService } from 'src/services/otp.service';

@Module({
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
