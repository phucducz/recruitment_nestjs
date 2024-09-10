import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from 'src/dto/auth/register.dto';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import { UsersService } from 'src/services/users.service';
import { UsersConverter } from '../users/users.converter';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`API-Gateway.${AuthService.name}`);

  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(UsersConverter) private readonly userConverter: UsersConverter,
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

  async signIn(
    signInDto: SignInDto,
  ): Promise<(any & { accessToken: string }) | null> {
    this.logger.log(this.signIn.name);
    const { type } = signInDto;

    try {
      const currentUser = await this.userService.findByEmail(signInDto.email);
      const userInfo = this.userConverter.entityToBasicInfo(currentUser);

      if (type === 'google') {
        if (!currentUser) {
          const result = await this.register({
            email: signInDto.email,
            password: undefined,
            fullName: signInDto.fullName,
            type: 'user',
          });

          return this.userConverter.entityToBasicInfo(
            await this.userService.findByEmail(result.email),
          );
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
}
