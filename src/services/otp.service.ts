import { Injectable } from '@nestjs/common';

@Injectable()
export class OTPService {
  constructor() {}

  private otp = new Map<number, number>();

  generateOTP(userId: number) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    this.otp.set(userId, otp);

    return otp;
  }

  verifyOTP(userId: number, otp: number) {
    const storedOTP = this.otp.get(userId);

    console.log('otp obj', this.otp);
    console.log('user otp', this.otp.get(userId));

    if (storedOTP === otp) {
      this.otp.delete(userId);
      return true;
    }

    return false;
  }
}
