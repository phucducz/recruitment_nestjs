import { forwardRef, Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { CreateRefreshTokenDto } from 'src/dto/refresh_token/create-refresh_token.dto';
import { RefreshAccessTokenDto } from 'src/dto/refresh_token/refresh-access_token.dto';
import { UpdateRefreshTokenDto } from 'src/dto/refresh_token/update-refresh_token.dto';
import { UsersService } from 'src/services/users.service';
import { AuthService } from '../auth/auth.service';
import { RefreshTokensRepository } from './refresh_token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(RefreshTokensRepository)
    private readonly refreshTokenRepository: RefreshTokensRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(UsersService) private userService: UsersService,
  ) {}

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    return await this.refreshTokenRepository.create(
      createRefreshTokenDto.userId,
    );
  }

  async refresh(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const { refreshToken, userId } = refreshAccessTokenDto;

    await this.verifyRefreshToken(refreshToken);

    const { id, email, fullName } = await this.userService.findById(userId);

    return this.authService.generateToken(id, email, fullName);
  }

  async verifyRefreshToken(refreshToken: string) {
    const result =
      await this.refreshTokenRepository.findByRefreshToken(refreshToken);

    const isExpired = dayjs(result.expiresAt).isValid()
      ? dayjs(result.expiresAt).isSame(dayjs(new Date())) ||
        dayjs(result.expiresAt).isBefore(dayjs(new Date()))
      : false;

    if (!result) throw new Error('Invalid refresh token');
    if (isExpired) throw new Error('Expired refresh token');

    return true;
  }

  findAll() {
    return `This action returns all refreshToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} refreshToken`;
  }

  update(id: number, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    return `This action updates a #${id} refreshToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} refreshToken`;
  }
}
