import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { ResetPasswordDto } from 'src/dto/auth/forgot-password.dto';
import { LogOutDto } from 'src/dto/auth/log-out.dto';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { SendOTPDto } from 'src/dto/auth/send-otp.dto';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import { VerifyOTPDto } from 'src/dto/auth/verify-otp.dto';
import { SendSignUpVerificationEmailDto } from 'src/dto/mail/send-verify-email.dto';
import { VerifySignUpTokenDto } from 'src/dto/mail/verify-email-sign-up.dto';
import { RefreshAccessTokenDto } from 'src/dto/refresh_token/refresh-access_token.dto';
import { VerifyResetPasswordTokenDto } from 'src/dto/users/verify-forgot-password-token.dto';
import { ResetPasswordService } from 'src/services/forgot_password.service';
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
    @Inject(ResetPasswordService)
    private readonly resetPasswordService: ResetPasswordService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
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
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      return res
        .status(500)
        .json({
          statusCode: 500,
          message: `Đăng nhập thất bại. ${error?.message ?? error}`,
        });
    }
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
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @Post('/verify-otp')
  async verifyOTP(@Body() verifyOTPDto: VerifyOTPDto, @Res() res: Response) {
    try {
      const { email, otp } = verifyOTPDto;

      const currentUser = await this.userService.findByEmail(email, {
        hasRelations: false,
      });

      if (!currentUser)
        return res
          .status(404)
          .json({ message: `Không tìm thấy người dùng ${email}` });

      this.otpService.verifyOTP(currentUser.id, otp);

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

      return res.status(200).json({
        statusCode: 200,
        message: 'Đăng nhập thành công!',
        ...result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error?.message ?? 'Có lỗi xảy ra khi xác thực OTP',
        statusCode: 500,
      });
    }
  }

  @Post('/send-reset-password-url')
  async sendResetPasswordUrl(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const { email } = resetPasswordDto;
      const currentUser = await this.userService.findByEmail(email, {
        hasRelations: false,
      });

      if (!currentUser)
        throw new NotFoundException(
          `Không tìm thấy người dùng ${email} trên hệ thống`,
        );

      const token = await this.resetPasswordService.generate({
        email,
        userId: currentUser.id,
      });

      await this.mailService.sendResetPasswordURL(email, {
        token,
        email,
        fullName: currentUser.fullName,
      });

      this.resetPasswordService.log();

      res.status(200).json({
        message:
          'Link khôi phục mật khẩu đã được gửi vào mail của bạn. Vui lòng kiểm tra mail.',
        statusCode: 200,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      res.status(500).json({
        message: error?.message ?? error,
        statusCode: 500,
      });
    }
  }

  @Post('/verify-reset-password-token')
  async verifyResetPasswordToken(
    @Body() verifyResetPasswordTokenDto: VerifyResetPasswordTokenDto,
    @Res() res: Response,
  ) {
    try {
      await this.resetPasswordService.verify(verifyResetPasswordTokenDto);

      return res.status(200).json({ message: 'Token hợp lệ', statusCode: 200 });
    } catch (error) {
      throw error;
    }
  }

  @Post('/send-sign-up-verification-email')
  async sendSignUpVerificationEmail(
    @Body() sendSignUpVerificationEmailDto: SendSignUpVerificationEmailDto,
    @Res() res: Response,
  ) {
    try {
      this.mailService.sendSignUpVerificationEmailURL(
        sendSignUpVerificationEmailDto.email,
        {
          token: await this.mailService.generateVerifyEmailSignUpToken(
            sendSignUpVerificationEmailDto,
          ),
          fullName: sendSignUpVerificationEmailDto.fullName,
        },
      );

      return res.status(200).json({
        message:
          'Hãy kiểm tra email của bạn và tiến hành xác thực tài khoản Recruitment Web App',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error?.message ?? error, statusCode: 500 });
    }
  }

  @Post('/verify-sign-up-token')
  async verifySignUpToken(
    @Body() verifySignUpTokenDto: VerifySignUpTokenDto,
    @Res() res: Response,
  ) {
    try {
      const tokenVerified =
        await this.mailService.verifySignUpToken(verifySignUpTokenDto);
      const { email, fullName, rolesId, password } =
        (await this.jwtService.decode(
          tokenVerified,
        )) as SendSignUpVerificationEmailDto;

      const signUpResult = await this.authService.register({
        email,
        fullName,
        password: password,
        roleId: rolesId,
      });

      if (!signUpResult?.id)
        return res.status(401).json({
          message:
            'Đã xảy ra lỗi trong quá trình xác thực, đăng ký tài khoản thất bại!',
          statusCode: 401,
        });

      const signInResult = await this.authService.signIn({
        email,
        type: 'system',
        fullName,
        password,
      });

      if (!signInResult)
        return res.status(401).json({
          statusCode: 401,
          message:
            'Đã xảy ra lỗi trong quá trình xác thực, đăng ký tài khoản thất bại!',
        });

      res.cookie('refreshToken', signInResult?.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 7000,
      });

      this.mailService.deleteSignUpToken(email);

      return res.status(200).json({
        statusCode: 200,
        message: 'Đăng ký tài khoản thành công!',
        ...signInResult,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      )
        throw error;
      return res.status(500).json({
        message: error?.message ?? error,
        statusCode: 500,
      });
    }
  }
}
