import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { RolesRepository } from 'src/modules/roles/roles.repository';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesRepository.name);

  constructor(
    @Inject(RolesRepository) private readonly roleRepository: RolesRepository,
  ) {}

  async findById(id: number) {
    return this.roleRepository.findById(id);
  }

  async findByTitle(title: 'user' | 'employer' | 'admin') {
    return this.roleRepository.findByTitle(title);
  }

  async findAll(pagination: IPagination) {
    return this.roleRepository.findAll(pagination);
  }

  async create(createRoleDto: ICreate<CreateRoleDto>) {
    return await this.roleRepository.create(createRoleDto);
  }

  async createMany(createManyRoleDto: ICreateMany<CreateRoleDto>) {
    return await this.roleRepository.createMany(createManyRoleDto);
  }
}
