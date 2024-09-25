import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/dto/auth/register.dto';

import { User } from 'src/entities/user.entity';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class UsersService {
  constructor(@Inject() private readonly userRepository: UsersRepository) {}

  async findByEmail(email: string, hasPassword?: boolean): Promise<User | null> {
    return await this.userRepository.findByEmail(email, hasPassword);
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findAll(pagination: IPagination) {
    return await this.userRepository.findAll(pagination);
  }

  async isExist(email: string): Promise<boolean> {
    return await this.userRepository.isExist(email);
  }

  async create(registerDto: RegisterDto) {
    return await this.userRepository.save(registerDto);
  }
}
