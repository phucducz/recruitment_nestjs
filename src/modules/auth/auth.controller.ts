import { Body, Controller, Inject, Post, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { LogOutDto } from 'src/dto/auth/log-out.dto';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { SendOTPDto } from 'src/dto/auth/send-otp.dto';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import { VerifyOTPDto } from 'src/dto/auth/verify-otp.dto';
import { RefreshAccessTokenDto } from 'src/dto/refresh_token/refresh-access_token.dto';
import { MailService } from 'src/services/mail.service';
import { OTPService } from 'src/services/otp.service';
import { UsersService } from 'src/services/users.service';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(RefreshTokenService)
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(OTPService) private readonly otpService: OTPService,
    @Inject(MailService) private readonly mailService: MailService,
  ) {}

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const result = await this.authService.signIn(signInDto);

    if (!result?.id)
      return res.status(401).json({
        statusCode: 401,
        message: 'Đăng nhập thất bại. Sai tên tài khoản hoặc mật khẩu!',
      });

    res.cookie('refreshToken', result?.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 7000,
    });

    return res
      .status(200)
      .json({ statusCode: 200, message: 'Đăng nhập thành công!', ...result });
  }

  @Post('/refresh')
  async create(
    @Body() _: RefreshAccessTokenDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const refreshToken = request.headers.cookies;

      if (!refreshToken)
        return res
          .status(401)
          .json({ message: 'Unauthorized', statusCode: 401 });

      const token = await this.refreshTokenService.refresh(refreshToken);

      if (token)
        return res.status(200).json({
          statusCode: 200,
          message: 'Làm mới access token thành công',
          accessToken: token,
        });

      return res.status(401).json({
        statusCode: 401,
        message: 'Tạo mới access token không thành công',
        accessToken: token,
      });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: `${error}` });
    }
  }

  @Post('/log-out')
  async logout(
    @Body() _: LogOutDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    try {
      const refreshToken = request.headers.cookies;

      if (!refreshToken)
        return res
          .status(401)
          .json({ message: 'Unauthorized', statusCode: 401 });

      const result = await this.authService.logout(refreshToken);

      res.clearCookie('refreshToken');

      if (result)
        return res
          .status(200)
          .json({ statusCode: 200, message: 'Đăng xuất thành công' });

      return res
        .status(401)
        .json({ statusCode: 401, message: 'Đăng xuất thất bại' });
    } catch (error) {
      return res.status(500).json({ stautsCode: 500, message: error });
    }
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<APIResponse> {
    if (await this.userService.isExist(registerDto.email))
      return {
        message: 'Email đã được sử dụng!',
        statusCode: 400,
      };

    const result = await this.authService.register(registerDto);

    if (result.id)
      return {
        message: 'Đăng ký tài khoản thành công!',
        statusCode: 200,
      };

    return {
      message: 'Đăng ký tài khoản thất bại!',
      statusCode: 401,
    };
  }

  @Post('/send-otp')
  async sendOTP(@Body() sendOTPDto: SendOTPDto, @Res() res: Response) {
    try {
      const { email } = sendOTPDto;
      const currentUser = await this.userService.findByEmail(email, {
        hasRelations: false,
      });

      if (!currentUser)
        return res
          .status(404)
          .json({ message: `Không tìm thấy người dùng ${email}` });

      await this.mailService.sendOTPEmail(
        email,
        this.otpService.generateOTP(currentUser.id),
      );

      return res.status(200).json({
        message: `Mã OTP đã được gửi qua email ${email} thành công`,
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error, statusCode: 500 });
    }
  }

  @Post('/verify-otp')
  async verifyOTP(@Body() verifyOTPDto: VerifyOTPDto, @Res() res: Response) {
    try {
      const { email, otp } = verifyOTPDto;

      const currentUser = await this.userService.findByEmail(email, {
        hasRelations: false,
      });

      console.log('currentUser', currentUser);
      
      if (!currentUser)
        return res
          .status(404)
          .json({ message: `Không tìm thấy người dùng ${email}` });

      if (this.otpService.verifyOTP(currentUser.id, otp)) {
        const result = await this.authService.signIn({ email, type: 'google' });

        if (!result?.id)
          return res.status(401).json({
            statusCode: 401,
            message: 'Đăng nhập thất bại. Sai tên tài khoản hoặc mật khẩu!',
          });

        res.cookie('refreshToken', result?.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 7000,
        });

        return res
          .status(200)
          .json({
            statusCode: 200,
            message: 'Đăng nhập thành công!',
            ...result,
          });
      }

      return res
        .status(401)
        .json({ message: 'OTP không khớp', statusCode: 401 });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error, statusCode: 500 });
    }
  }
}
