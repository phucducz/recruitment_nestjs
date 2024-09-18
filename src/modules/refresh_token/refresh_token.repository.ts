import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { LogOutDto } from 'src/dto/auth/log-out.dto';
import {
  REFRESH_TOKEN_STATUS,
  RefreshToken,
} from 'src/entities/refresh_token.entity';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async findById(id: number) {
    return await this.refreshTokenRepository.findOneBy({ id: id });
  }

  async findByRefreshToken(refreshToken: string) {
    return await this.refreshTokenRepository.findOneBy({
      refreshToken: refreshToken,
    });
  }

  async create({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }): Promise<RefreshToken> {
    return await this.refreshTokenRepository.save({
      createAt: new Date().toString(),
      createBy: userId,
      expiresAt: dayjs().add(7, 'day').toDate().toString(),
      refreshToken: refreshToken,
      status: REFRESH_TOKEN_STATUS.VALID,
      user: await this.userService.findById(userId),
    });
  }

  async update(logoutDto: LogOutDto) {
    const { refreshToken, usersId } = logoutDto;
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      refreshToken: refreshToken,
    });

    const result = await this.refreshTokenRepository.update(
      { id: refreshTokenEntity.id },
      {
        status: REFRESH_TOKEN_STATUS.INVALID,
        updateAt: new Date().toString(),
        updateBy: usersId,
      },
    );

    return result.affected > 0;
  }
}
