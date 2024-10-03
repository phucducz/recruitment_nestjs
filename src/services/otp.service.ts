import { Injectable } from '@nestjs/common';

import { BLOCK_TIME, MAX_SEND_COUNT } from 'src/common/utils/constants';

@Injectable()
export class OTPService {
  constructor() {}

  private otp = new Map<number, IOTP>();

  generateOTP(userId: number) {
    const oldOTP = this.otp.get(userId);
    let attemptCount = 0;
    let sendCount = 1;

    if (oldOTP) {
      let timeSinceLastSend = Date.now() - oldOTP.lastSentAt;

      if (oldOTP.sendCount >= MAX_SEND_COUNT && timeSinceLastSend < BLOCK_TIME)
        throw new Error(
          `Bạn đã yêu cầu mã OTP quá nhiều lần, vui lòng đợi 15 phút sau để có thể gửi yêu cầu mới!`,
        );

      if (timeSinceLastSend >= BLOCK_TIME) sendCount = 0;
      else sendCount = oldOTP.sendCount + 1;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    this.otp.set(userId, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attemptCount,
      sendCount,
      lastSentAt: Date.now(),
    });

    this.log();

    return otp;
  }

  log() {
    console.log(this.otp);
  }

  verifyOTP(userId: number, otp: number) {
    const storedData = this.otp.get(userId);

    if (storedData.attemptCount >= 3)
      throw new Error(
        'Bạn đã thử sai quá nhiều lần, vui lòng yêu cầu mã OTP mới!',
      );

    this.otp.set(userId, {
      ...storedData,
      attemptCount: storedData.attemptCount + 1,
    });

    if (!storedData) throw new Error('OTP không hợp lệ!');
    if (storedData.otp !== otp) throw new Error('OTP không đúng!');
    if (Date.now() > storedData.expiresAt) throw new Error('OTP đã hết hạn!');

    this.otp.delete(userId);

    return true;
  }
}
