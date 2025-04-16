import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { ChangePasswordDto } from 'src/dto/users/change-password.dto';
import { DataSource, Repository } from 'typeorm';

import { STATUS_CODE } from 'src/common/utils/enums';
import { UpdateAccountInfoDto } from 'src/dto/users/update-accounnt-info.dto';
import { UpdatePersonalInfoDto } from 'src/dto/users/update-personal-info.dto';
import { UserWithExtrasDto } from 'src/dto/users/user-with-extras.dto';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { MenuViewGroup } from 'src/entities/menu_view_group.entity';
import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { CloudinaryService } from './cloudinary.service';
import { DesiredJobsService } from './desired_jobs.service';
import { FunctionalsService } from './functionals.service';
import { JobFieldsService } from './job_fields.service';
import { JobPositionsService } from './job_positions.service';
import { PlacementsService } from './placements.service';
import { RolesService } from './roles.service';
import { RolesFunctionalsService } from './roles_functionals.service';
import { StatusService } from './status.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => FunctionalsService))
    private readonly functionalsService: FunctionalsService,
    @Inject(forwardRef(() => RolesFunctionalsService))
    private readonly rolesFunctionalsService: RolesFunctionalsService,
    @Inject(RolesService) private readonly roleService: RolesService,
    @Inject(StatusService) private readonly statusService: StatusService,
    @Inject(forwardRef(() => JobPositionsService))
    private readonly jobPositionService: JobPositionsService,
    @Inject(CloudinaryService)
    private readonly cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => DesiredJobsService))
    private readonly desiredJobService: DesiredJobsService,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
    @Inject(PlacementsService)
    private readonly placementsService: PlacementsService,
    @InjectRepository(MenuViewGroup)
    private menuViewGroupRepository: Repository<MenuViewGroup>,
    @InjectRepository(RolesFunctional)
    private rolesFunctionalsRepository: Repository<RolesFunctional>,
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
    const result = await this.userRepository.findById(id, options);
    if (!result) throw new NotFoundException('Không tìm thấy người dùng');

    const desiredJob = await this.desiredJobService.findOneBy({
      where: { user: { id } },
    });

    const viewGroups = await this.buildViewGroups(result.role.id);

    const userWithExtras: UserWithExtrasDto = {
      ...result,
      viewGroups,
      desiredJob: {
        totalYearExperience: desiredJob?.totalYearExperience ?? null,
      } as DesiredJob,
    };

    return userWithExtras;
  }

  async buildViewGroups(roleId: number) {
    const [menuViewGroups, rolesFunctionals] = await Promise.all([
      await this.menuViewGroupRepository.find({
        relations: ['menuViews', 'menuViews.functionals'],
        order: { orderIndex: 'ASC' },
      }),
      await this.rolesFunctionalsRepository.find({
        where: { rolesId: roleId },
        relations: ['functional'],
      }),
    ]);

    const functionalIds = rolesFunctionals.map(
      (rolesFunctional) => rolesFunctional.functionalsId,
    );

    const viewGroups: MenuViewGroup[] = menuViewGroups
      .map((menuViewGroup) => {
        const views = menuViewGroup.menuViews
          .filter((menuView) =>
            menuView.functionals?.some((f) => functionalIds.includes(f?.id)),
          )
          .map((menuView) => {
            const functionals = menuView.functionals?.filter(
              (functionals) =>
                functionals && functionalIds.includes(functionals.id),
            );

            return {
              ...menuView,
              functionals,
            };
          });

        return { ...menuViewGroup, menuViews: views };
      })
      .filter((menuViewGroup) => menuViewGroup.menuViews.length);

    return viewGroups;
  }

  async findAll(userQueries: IUserQueries) {
    return await this.userRepository.findAll(userQueries);
  }

  async isExist(email: string): Promise<boolean> {
    return await this.userRepository.isExist(email);
  }

  async create(registerDto: RegisterDto) {
    return await this.userRepository.save({
      ...registerDto,
      role: await this.roleService.findById(registerDto.roleId),
      status: await this.statusService.findByCode(STATUS_CODE.ACCOUNT_ACTIVE),
      jobPosition: await this.jobPositionService.findById(
        registerDto.jobPositionsId,
      ),
      jobFields: await this.jobFieldService.findByIds(
        registerDto?.jobFieldsIds ?? [],
      ),
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
      Omit<UpdateAccountInfoDto, 'isChangePassword'> & {
        file: Express.Multer.File;
        isChangePassword: boolean;
      }
    >,
  ) {
    const { updateBy, variable } = updateAccountInfoDto;
    const { file, ...otherVariables } = variable;
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

    let avatarUrl: string | null = null;

    if (variable.file)
      avatarUrl = await this.cloudinaryService.updateAvatar(
        variable.file,
        currentUser.avatarUrl,
      );

    return await this.userRepository.updateAccountInfo({
      ...updateAccountInfoDto,
      variable: {
        ...otherVariables,
        ...(otherVariables.newPassword && {
          newPassword: await this.authService.hashPassword(
            otherVariables.newPassword,
          ),
        }),
        avatarUrl,
      },
    });
  }

  async updatePersonalInfo(
    updatePersonalInfoDto: IUpdate<
      UpdatePersonalInfoDto & { file: Express.Multer.File }
    >,
  ) {
    const { updateBy, variable } = updatePersonalInfoDto;
    const currentUser = await this.userRepository.findById(updateBy, {
      hasRelations: false,
    });

    if (!currentUser) throw new NotFoundException('Không tìm thấy người dùng');

    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const desiredJob = await this.desiredJobService.findOneBy({
          where: { user: { id: currentUser.id } },
        });

        if (desiredJob)
          await this.desiredJobService.update(desiredJob.id, {
            updateBy,
            variable: { totalYearExperience: +variable.totalYearExperience },
            transactionalEntityManager,
          });

        let avatarUrl: string | null = null;

        if (variable.file)
          avatarUrl = await this.cloudinaryService.updateAvatar(
            variable.file,
            currentUser.avatarUrl,
          );

        console.log({
          fullName: variable.fullName,
          ...(variable.jobPositionsId && {
            jobPosition: await this.jobPositionService.findById(
              +variable.jobPositionsId,
            ),
          }),
          ...(variable.placementsId && {
            placement: await this.placementsService.findById(
              +variable.placementsId,
            ),
          }),
          ...(variable.phoneNumber && { phoneNumber: variable.phoneNumber }),
          ...(variable.companyName && { companyName: variable.companyName }),
          ...(variable.companyUrl && { companyUrl: variable.companyUrl }),
          ...(variable.file && { avatarUrl }),
        });

        const result = await transactionalEntityManager.update(
          User,
          currentUser.id,
          {
            fullName: variable.fullName,
            ...(variable.jobPositionsId && {
              jobPosition: await this.jobPositionService.findById(
                +variable.jobPositionsId,
              ),
            }),
            ...(variable.placementsId && {
              placement: await this.placementsService.findById(
                +variable.placementsId,
              ),
            }),
            ...(variable.phoneNumber && { phoneNumber: variable.phoneNumber }),
            ...(variable.companyName && { companyName: variable.companyName }),
            ...(variable.companyUrl && { companyUrl: variable.companyUrl }),
            ...(variable.file && { avatarUrl }),
          },
        );

        return result.affected > 0;
      },
    );
  }

  async deleteAchivement(userId: number) {
    return (await this.userRepository.deleteAchivement(userId)).affected > 0;
  }
}
