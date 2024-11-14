import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import dayjs from 'dayjs';

import { JwtService } from '@nestjs/jwt';
import { UNAUTHORIZED_EXCEPTION_MESSAGE } from 'src/common/utils/enums';
import { CreateRefreshTokenDto } from 'src/dto/refresh_token/create-refresh_token.dto';
import { REFRESH_TOKEN_STATUS } from 'src/entities/refresh_token.entity';
import { UsersService } from 'src/services/users.service';
import { AuthService } from '../auth/auth.service';
import { RefreshTokensRepository } from './refresh_token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject()
    private readonly refreshTokenRepository: RefreshTokensRepository,
  ) {}

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    const refreshToken = await this.jwtService.signAsync(
      { userId: createRefreshTokenDto.userId },
      { expiresIn: '7d' },
    );

    return await this.refreshTokenRepository.create({
      refreshToken: refreshToken,
      userId: createRefreshTokenDto.userId,
    });
  }

  async refresh(refreshToken: string) {
    const { userId } = await this.authService.getByToken(refreshToken);

    await this.verifyRefreshToken(refreshToken);

    const { id, email, fullName } = await this.userService.findById(userId);

    return this.authService.generateToken(id, email, fullName);
  }

  async verifyRefreshToken(refreshToken: string) {
    const result =
      await this.refreshTokenRepository.findByRefreshToken(refreshToken);

    if (!result)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.INVALID_REFRESH_TOKEN,
      );

    const isExpired = dayjs(result.expiresAt).isValid()
      ? dayjs(result.expiresAt).isSame(dayjs(new Date())) ||
        dayjs(result.expiresAt).isBefore(dayjs(new Date()))
      : false;

    if (result.status === REFRESH_TOKEN_STATUS.INVALID || isExpired)
      throw new UnauthorizedException(
        UNAUTHORIZED_EXCEPTION_MESSAGE.REFRESH_TOKEN_EXPIRED,
      );

    return true;
  }

  async updateStatusByRefreshToken(refreshToken: string) {
    const { userId } = await this.authService.getByToken(refreshToken);

    return await this.refreshTokenRepository.updateStatusByRefreshToken({
      refreshToken,
      userId,
    });
  }
}
