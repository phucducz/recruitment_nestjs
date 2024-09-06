import { Body, Controller, Inject, Post } from '@nestjs/common';

import { RegisterDto } from 'src/dto/auth/register.dto';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import { UsersService } from 'src/services/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(UsersService) private readonly userService: UsersService,
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

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<APIResponse> {
    if (await this.userService.isExist(registerDto.email))
      return {
        message: 'Email đã được sử dụng!',
        statusCode: 400,
      };

    await this.authService.register(registerDto);

    if (this.userService.isExist(registerDto.email))
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
