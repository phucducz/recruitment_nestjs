import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { ChangePasswordDto } from 'src/dto/users/change-password.dto';

import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findByEmail(
    email: string,
    options?: IGenerateRelationshipOptional,
  ): Promise<User | null> {
    return await this.userRepository.findByEmail(email, options);
  }

  async findById(
    id: number,
    options?: IGenerateRelationshipOptional,
  ): Promise<User | null> {
    return await this.userRepository.findById(id, options);
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

  async changePassword(changePasswordDto: IUpdate<ChangePasswordDto>) {
    const { updateBy, variable } = changePasswordDto;
    const currentUser = await this.findById(updateBy, { hasPassword: true });

    if (!currentUser) throw new NotFoundException('Không tìm thấy người dùng');
    if (
      !(await this.authService.comparePassword(
        variable.oldPassword,
        currentUser.password,
      ))
    )
      throw new BadRequestException('Mật khẩu cũ không chính xác');

    return await this.userRepository.changePassword({
      id: updateBy,
      password: await this.authService.hashPassword(variable.newPassword),
    });
  }
}
