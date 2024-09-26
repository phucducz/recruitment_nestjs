import { Injectable } from '@nestjs/common';

@Injectable()
export class OTPService {
  constructor() {}

  private otp = new Map<number, { otp: number; expiresAt: number }>();

  generateOTP(userId: number) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    this.otp.set(userId, { otp: otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    return otp;
  }

  verifyOTP(userId: number, otp: number) {
    try {
      const { expiresAt, otp: storedOTP } = this.otp.get(userId);

      if (storedOTP !== otp) throw new Error('OTP không tồn tại');
      if (Date.now() > expiresAt) throw new Error('OTP đã hết hạn');

      this.otp.delete(userId);

      return true;
    } catch (error) {
      console.log(error);
      throw new Error('OTP không hợp lệ');
    }
  }
}
