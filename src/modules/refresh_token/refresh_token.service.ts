import { forwardRef, Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { JwtService } from '@nestjs/jwt';
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
    @Inject(UsersService) private userService: UsersService,
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

    console.log('result', result);
    console.log('refreshToken', refreshToken);

    if (!result) throw new Error('Invalid refresh token');

    const isExpired = dayjs(result.expiresAt).isValid()
      ? dayjs(result.expiresAt).isSame(dayjs(new Date())) ||
        dayjs(result.expiresAt).isBefore(dayjs(new Date()))
      : false;

    console.log('isExpired var', isExpired);
    console.log(
      'isExpired',
      result.status === REFRESH_TOKEN_STATUS.INVALID || isExpired,
    );

    if (result.status === REFRESH_TOKEN_STATUS.INVALID || isExpired)
      throw new Error('Expired refresh token');

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
