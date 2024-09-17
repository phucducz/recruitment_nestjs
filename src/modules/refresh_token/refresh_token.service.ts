import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import { JwtService } from '@nestjs/jwt';
import { LogOutDto } from 'src/dto/auth/log-out.dto';
import { CreateRefreshTokenDto } from 'src/dto/refresh_token/create-refresh_token.dto';
import { RefreshAccessTokenDto } from 'src/dto/refresh_token/refresh-access_token.dto';
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

  async hashRefreshToken(refreshToken: string) {
    return await bcrypt.hash(refreshToken, 10);
  }

  async compareRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(refreshToken, hashedRefreshToken);
  }

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    const refreshToken = await this.jwtService.signAsync(
      { userId: createRefreshTokenDto.userId },
      { expiresIn: '7d' },
    );
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);

    return await this.refreshTokenRepository.create({
      refreshToken: refreshToken,
      hashedRefreshToken: hashedRefreshToken,
      userId: createRefreshTokenDto.userId,
    });
  }

  async refresh(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const { refreshToken, usersId, refreshTokensId } = refreshAccessTokenDto;

    await this.verifyRefreshToken({ id: refreshTokensId, refreshToken });

    const { id, email, fullName } = await this.userService.findById(usersId);

    return this.authService.generateToken(id, email, fullName);
  }

  async verifyRefreshToken(params: { id: number; refreshToken: string }) {
    const { id, refreshToken } = params;

    const result = await this.refreshTokenRepository.findById(id);

    if (!result) throw new Error('Invalid refresh token');

    if (!(await this.compareRefreshToken(refreshToken, result.refreshToken)))
      throw new Error('Invalid refresh token');

    const isExpired = dayjs(result.expiresAt).isValid()
      ? dayjs(result.expiresAt).isSame(dayjs(new Date())) ||
        dayjs(result.expiresAt).isBefore(dayjs(new Date()))
      : false;

    if (result.status === REFRESH_TOKEN_STATUS.INVALID || isExpired)
      throw new Error('Expired refresh token');

    return true;
  }

  async update(logoutDto: LogOutDto) {
    return await this.refreshTokenRepository.update(logoutDto);
  }
}
