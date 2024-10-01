import { Injectable } from '@nestjs/common';

@Injectable()
export class OTPService {
  constructor() {}

  private otp = new Map<number, { otp: number; expiresAt: number }>();

  generateOTP(userId: number) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    this.otp.set(userId, { otp: otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    this.log();

    return otp;
  }

  log() {
    console.log(this.otp);
  }

  verifyOTP(userId: number, otp: number) {
    const storedData = this.otp.get(userId);

    if (!storedData) throw new Error('OTP không hợp lệ');
    if (storedData.otp !== otp) throw new Error('OTP không đúng');
    if (Date.now() > storedData.expiresAt) throw new Error('OTP đã hết hạn');

    this.otp.delete(userId);

    return true;
  }
}
