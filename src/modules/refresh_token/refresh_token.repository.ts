import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { LogOutDto } from 'src/dto/auth/log-out.dto';
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async findByRefreshToken(refreshToken: string) {
    return await this.refreshTokenRepository.findOneBy({
      refreshToken: refreshToken,
    });
  }

  async create({
    refreshToken,
    userId,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    return await this.refreshTokenRepository.save({
      createAt: new Date().toString(),
      createBy: userId,
      expiresAt: dayjs().add(7, 'day').toDate().toString(),
      refreshToken: refreshToken,
      status: 'valid',
      user: await this.userService.findById(userId),
    });
  }

  async update(logoutDto: LogOutDto) {
    const { refreshToken, userId } = logoutDto;
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      refreshToken: refreshToken,
      user: await this.userService.findById(userId),
    });
    const result = await this.refreshTokenRepository.update(
      { id: refreshTokenEntity.id },
      { status: 'in valid', updateAt: new Date().toString(), updateBy: userId },
    );

    return result.affected > 0;
  }
}
