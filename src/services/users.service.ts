import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { ChangePasswordDto } from 'src/dto/users/change-password.dto';

import { UpdateAccountInfoDto } from 'src/dto/users/update-accounnt-info.dto';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { JobPositionsService } from './job_positions.service';
import { RolesService } from './roles.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(RolesService) private readonly roleService: RolesService,
    @Inject(forwardRef(() => JobPositionsService))
    private readonly jobPositionService: JobPositionsService,
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

  async findAll(userQueries: IUserQueries) {
    return await this.userRepository.findAll(userQueries);
  }

  async isExist(email: string): Promise<boolean> {
    return await this.userRepository.isExist(email);
  }

  async create(registerDto: RegisterDto) {
    const role = await this.roleService.findById(registerDto.roleId);
    const jobPosition = await this.jobPositionService.findById(
      registerDto.jobPositionsId,
    );

    return await this.userRepository.save({
      ...registerDto,
      role,
      jobPosition,
    });
  }

  async hasPassword(userId: number) {
    return !!(await this.userRepository.findById(userId, {
      hasPassword: true,
    }));
  }

  async verifyPassword(oldPassword: string, storedPassword: string) {
    if (!(await this.authService.comparePassword(oldPassword, storedPassword)))
      throw new BadRequestException('Mật khẩu cũ không chính xác');

    return true;
  }

  async changePassword(changePasswordDto: IUpdate<ChangePasswordDto>) {
    const { updateBy, variable } = changePasswordDto;
    const currentUser = await this.findById(updateBy, { hasPassword: true });

    if (!currentUser) throw new NotFoundException('Không tìm thấy người dùng');

    if (!currentUser.password)
      return await this.updatePassword(
        updateBy,
        await this.authService.hashPassword(variable.newPassword),
      );

    if (!!currentUser.password) {
      if (!variable?.oldPassword)
        throw new BadRequestException(
          'Vui lòng cung cấp mật khẩu cũ của bạn để xác nhận thông tin',
        );

      await this.verifyPassword(variable.oldPassword, currentUser.password);
    }

    return await this.updatePassword(
      updateBy,
      await this.authService.hashPassword(variable.newPassword),
    );
  }

  async updatePassword(id: number, newPassword: string) {
    return await this.userRepository.changePassword({
      id,
      password: newPassword,
    });
  }

  async updateAccountInfo(
    updateAccountInfoDto: IUpdate<
      UpdateAccountInfoDto & { avatarUrl: string | null }
    >,
  ) {
    const { updateBy, variable } = updateAccountInfoDto;
    const currentUser = await this.findById(updateBy, { hasPassword: true });

    if (!currentUser) throw new NotFoundException('Không tìm thấy người dùng');

    if (
      variable.newPassword &&
      variable.isChangePassword &&
      !!currentUser.password
    ) {
      if (!variable?.oldPassword)
        throw new BadRequestException(
          'Vui lòng cung cấp mật khẩu cũ của bạn để xác nhận thông tin',
        );
      await this.verifyPassword(variable.oldPassword, currentUser.password);
    }

    return await this.userRepository.updateAccountInfo({
      ...updateAccountInfoDto,
      variable: {
        ...variable,
        ...(variable.newPassword && {
          newPassword: await this.authService.hashPassword(
            variable.newPassword,
          ),
        }),
      },
    });
  }
}
