import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from 'src/dto/auth/register.dto';
import { SignInDto } from 'src/dto/auth/sign-in.dto';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`API-Gateway.${AuthService.name}`);

  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(UsersService) private readonly userService: UsersService,
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
  ): Promise<(Omit<User, 'password'> & { accessToken: string }) | null> {
    this.logger.log(this.signIn.name);

    try {
      const currentUser = await this.userService.findByEmail(signInDto.email);

      if (
        !currentUser ||
        (currentUser &&
          !(await this.comparePassword(
            signInDto.password,
            currentUser.password,
          )))
      )
        return null;

      const { password, ...info } = currentUser;

      return {
        ...info,
        accessToken: await this.jwtService.signAsync({
          id: info.id,
          email: info.email,
        }),
      };
    } catch (error) {
      this.logger.log(error);
      return null;
    }
  }

  async register(registerDto: RegisterDto) {
    await this.userService.create({
      ...registerDto,
      password: await this.hashPassword(registerDto.password),
    });
  }
}
