import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { RefreshToken } from 'src/entities/refresh_token.entity';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async findByRefreshToken(refreshToken: string) {
    return await this.refreshTokenRepository.findOneBy({
      refreshToken: refreshToken,
    });
  }

  async create(userId: number) {
    return await this.refreshTokenRepository.save({
      createAt: new Date().toString(),
      createBy: userId,
      expiresAt: dayjs().add(7, 'day').toDate().toString(),
      refreshToken: await this.jwtService.signAsync(
        { userId: userId },
        { expiresIn: '7d' },
      ),
      user: await this.userService.findById(userId),
    });
  }
}
