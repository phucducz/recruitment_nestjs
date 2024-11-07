import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UNAUTHORIZED_EXCEPTION_MESSAGE } from 'src/common/utils/enums';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import { RolesService } from 'src/services/roles.service';
import { UsersService } from 'src/services/users.service';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';
import { UsersConverter } from '../users/users.converter';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`API-Gateway.${AuthService.name}`);

  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(UsersConverter) private readonly userConverter: UsersConverter,
    @Inject(RolesService) private readonly roleService: RolesService,
    @Inject(forwardRef(() => RefreshTokenService))
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async comparePassword(password: string, storedPasswordHash: string) {
    return await bcrypt.compare(password, storedPasswordHash);
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }

  async getByToken(accessToken: string) {
    return await this.jwtService.decode(accessToken);
  }

  async compareToken(accessToken: string, refreshToken: string) {
    const access = await this.getByToken(accessToken);
    const refresh = await this.getByToken(refreshToken);

    if (access.userId !== refresh.userId)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.INVALID_TOKEN,
      );

    return true;
  }

  async generateToken(id: number, email: string, fullName: string) {
    return await this.jwtService.signAsync(
      { userId: id, email, fullName },
      { expiresIn: '15m' },
    );
  }

  async validateUser(payload: any) {
    return {
      userId: payload.id,
      fullName: payload.fullName,
      email: payload.email,
    };
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<
    (any & { accessToken: string | null; refreshToken: string | null }) | null
  > {
    this.logger.log(this.signIn.name);
    const { type } = signInDto;

    const currentUser = await this.userService.findByEmail(signInDto.email, {
      hasPassword: true,
      hasRelations: false,
    });

    let refreshToken = null;
    let userInfo = null;

    if (currentUser) {
      const rf = await this.refreshTokenService.create({
        userId: currentUser.id,
      });
      refreshToken = rf.refreshToken;

      userInfo = {
        ...this.userConverter.entityToBasicInfo(currentUser),
        accessToken: currentUser
          ? await this.generateToken(
              currentUser.id,
              currentUser.email,
              currentUser.fullName,
            )
          : null,
        refreshToken: refreshToken,
      };
    }

    if (type === 'google') {
      if (!currentUser) {
        const role = await this.roleService.findByTitle('user');

        if (!role) return null;

        const result = await this.register({
          email: signInDto.email,
          password: undefined,
          fullName: signInDto.fullName,
          roleId: role.id,
          avatarURL: signInDto.avatarURL,
        });
        const { refreshToken: rf } = await this.refreshTokenService.create({
          userId: result.id,
        });

        return {
          ...this.userConverter.entityToBasicInfo(
            await this.userService.findByEmail(result.email),
          ),
          accessToken: await this.generateToken(
            result.id,
            result.email,
            result.fullName,
          ),
          refreshToken: rf,
        };
      }

      return userInfo;
    }

    if (!signInDto.password)
      throw new BadRequestException('Vui lòng cung cấp mật khẩu!');
    if (!currentUser.password)
      throw new BadRequestException('Hãy đặt mật khẩu cho tài khoản của bạn!');

    if (
      !currentUser ||
      !(await this.comparePassword(signInDto.password, currentUser.password))
    )
      return null;

    return userInfo;
  }

  async register(registerDto: RegisterDto) {
    const { password, ...others } = registerDto;

    return await this.userService.create({
      ...others,
      password: password ? await this.hashPassword(password) : null,
    });
  }

  async logout(refreshToken: string) {
    return await this.refreshTokenService.updateStatusByRefreshToken(
      refreshToken,
    );
  }
}
