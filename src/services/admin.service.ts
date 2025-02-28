import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatUserByAdminDto } from 'src/dto/admin/update-user.dto';
import { UsersRepository } from 'src/modules/users/users.repository';
import { RolesService } from './roles.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly roleService: RolesService,
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
  ) {}

  async updateUserRole(updateUserRoleDto: IUpdate<UpdatUserByAdminDto>) {
    const { updateBy, variable } = updateUserRoleDto;

    const currentUser = await this.userRepository.findById(variable.userId, {
      hasRelations: false,
    });
    if (!currentUser) throw new NotFoundException('Không tìm thấy người dùng');

    const role = await this.roleService.findById(variable.roleId);
    if (!role) throw new NotFoundException('Không tìm thấy chức vụ');

    return await this.userRepository.updateUserRole({
      updateBy,
      variable,
    });
  }
}
