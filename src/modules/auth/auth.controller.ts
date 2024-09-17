import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { RegisterDto } from 'src/dto/auth/register.dto';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import { RefreshAccessTokenDto } from 'src/dto/refresh_token/refresh-access_token.dto';
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
  ) {}

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(signInDto);

    if (!result?.id)
      return {
        message: 'Đăng nhập thất bại. Sai tên tài khoản hoặc mật khẩu!',
        statusCode: 401,
      };

    return {
      ...result,
      message: 'Đăng nhập thành công!',
      statusCode: 200,
    };
  }

  @Post('/refresh')
  async create(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
    @Res() res: Response,
  ) {
    try {
      const token = await this.refreshTokenService.refresh(
        refreshAccessTokenDto,
      );

      if (token)
        return res.status(200).json({
          message: 'Làm mới access token thành công',
          accessToken: token,
        });

      return res.status(401).json({
        message: 'Tạo mới access token không thành công',
        accessToken: token,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Internal server error. ${error}`,
      });
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
}
