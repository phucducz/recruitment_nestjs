import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LogOutDto } from 'src/dto/auth/log-out.dto';
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
    @Inject(UsersService) private readonly userService: UsersService,
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

  async generateToken(id: number, email: string, fullName: string) {
    return await this.jwtService.signAsync(
      { id, email, fullName },
      { expiresIn: '30s' },
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

    try {
      const currentUser = await this.userService.findByEmail(signInDto.email);
      const { refreshToken } = await this.refreshTokenService.create({
        userId: currentUser.id,
      });

      const userInfo = {
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

      if (type === 'google') {
        if (!currentUser) {
          const role = await this.roleService.findByTitle('user');

          if (!role) return null;

          const result = await this.register({
            email: signInDto.email,
            password: undefined,
            fullName: signInDto.fullName,
            roleId: role.id,
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
            refreshToken: refreshToken,
          };
        }

        return userInfo;
      }

      if (
        !currentUser ||
        !(await this.comparePassword(signInDto.password, currentUser.password))
      )
        return null;

      return userInfo;
    } catch (error) {
      this.logger.log(`signIn: ${error}`);
      return null;
    }
  }

  async register(registerDto: RegisterDto) {
    const { password, ...others } = registerDto;

    return await this.userService.create({
      ...others,
      password: password ? await this.hashPassword(password) : null,
    });
  }

  async logout(logoutDto: LogOutDto) {
    return await this.refreshTokenService.remove(logoutDto);
  }
}
