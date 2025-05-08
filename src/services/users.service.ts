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
import { DataSource, In, Repository } from 'typeorm';

import { PERMISSION_TYPE, STATUS_CODE } from 'src/common/utils/enums';
import { ViewGroupsResponseDto } from 'src/dto/menu_view_groups/get-menu_view_group.dto';
import { UpdateAccountInfoDto } from 'src/dto/users/update-accounnt-info.dto';
import { UpdatePersonalInfoDto } from 'src/dto/users/update-personal-info.dto';
import { UserWithExtrasDto } from 'src/dto/users/user-with-extras.dto';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { Functional } from 'src/entities/functional.entity';
import { MenuViewGroup } from 'src/entities/menu_view_group.entity';
import { MenuViews } from 'src/entities/menu_views.entity';
import { RolesFunctional } from 'src/entities/roles_functional.entity';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { CloudinaryService } from './cloudinary.service';
import { DesiredJobsService } from './desired_jobs.service';
import { JobFieldsService } from './job_fields.service';
import { JobPositionsService } from './job_positions.service';
import { PlacementsService } from './placements.service';
import { RolesService } from './roles.service';
import { StatusService } from './status.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
    @InjectRepository(MenuViews)
    private menuViewsRepository: Repository<MenuViews>,
    @InjectRepository(MenuViewGroup)
    private menuViewGroupRepository: Repository<MenuViewGroup>,
    @InjectRepository(RolesFunctional)
    private rolesFunctionalsRepository: Repository<RolesFunctional>,
    @InjectRepository(Functional)
    private functionalRepository: Repository<Functional>,
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
    isGetMenuView?: boolean,
  ): Promise<User | null> {
    let viewGroups: ViewGroupsResponseDto;

    const result = await this.userRepository.findById(id, options);
    if (!result) throw new NotFoundException('Không tìm thấy người dùng');

    const [desiredJob, rolesFunctionals, hasPassword] = await Promise.all([
      await this.desiredJobService.findOneBy({
        where: { user: { id } },
      }),
      await this.rolesFunctionalsRepository.find({
        where: { rolesId: result.role.id },
        relations: ['functional'],
      }),
      await this.checkUserHasPassword(id),
    ]);

    const functionalIds = rolesFunctionals.map((rf) => rf.functionalsId);
    const functionals = await this.functionalRepository.find({
      where: { id: In(functionalIds) },
      select: ['id', 'menuViewId', 'code'],
    });

    if (isGetMenuView)
      viewGroups = await this.buildViewGroups(functionalIds, functionals);

    const userWithExtras: UserWithExtrasDto = {
      ...result,
      ...viewGroups,
      hasPassword,
      functionals: functionals.map((fnc) => fnc.code),
      desiredJob: {
        totalYearExperience: desiredJob?.totalYearExperience ?? null,
      } as DesiredJob,
    };

    return userWithExtras;
  }

  async buildViewGroups(
    functionalIds: number[],
    functionals: Functional[],
  ): Promise<ViewGroupsResponseDto> {
    try {
      const userPermissionCodes = functionals.map((f) => f.code);
      const menuViewIds = [
        ...new Set(
          functionals.filter((f) => f.menuViewId).map((f) => f.menuViewId),
        ),
      ];

      const menuViews = await this.menuViewsRepository.find({
        where: { id: In(menuViewIds) },
        relations: ['functionals', 'group'],
        order: { orderIndex: 'ASC' },
      });

      const filteredMenuViews = menuViews
        .filter((menuView) => {
          const viewPermission = menuView.functionals.find(
            (f) =>
              f.code.includes(PERMISSION_TYPE.VIEW) ||
              f.code.includes(PERMISSION_TYPE.MANAGER),
          )?.code;

          return viewPermission && userPermissionCodes.includes(viewPermission);
        })
        .map((menuView) => {
          const filteredFunctionals = menuView.functionals
            .filter((f) => functionalIds.includes(f.id))
            .map((f) => ({
              id: f.id,
              title: f.title,
              code: f.code,
            }));

          return {
            id: menuView.id,
            title: menuView.title,
            iconType: menuView.iconType,
            icon: menuView.icon,
            path: menuView.path,
            orderIndex: menuView.orderIndex,
            functionals: filteredFunctionals,
            menuViewGroupId: menuView.group?.id || null,
          };
        });

      const menuViewGroups = await this.menuViewGroupRepository.find({
        order: { orderIndex: 'ASC' },
      });

      const viewGroups = menuViewGroups
        .map((group) => {
          const views = filteredMenuViews
            .filter((mv) => mv.menuViewGroupId === group.id)
            .sort((a, b) => a.orderIndex - b.orderIndex);

          return {
            id: group.id,
            title: group.title,
            orderIndex: group.orderIndex,
            menuViews: views,
          };
        })
        .filter((group) => group.menuViews?.length);

      const standaloneViews = filteredMenuViews
        .filter((mv) => !mv.menuViewGroupId)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      const result = {
        viewGroups,
        standaloneViews,
      };

      return result;
    } catch (error) {
      console.log('buildViewGroups Error:', error);
      throw new BadRequestException(error);
    }
  }

  async findAll(userQueries: IUserQueries) {
    return await this.userRepository.findAll(userQueries);
  }

  async userHasPassword() {
    return await this.userRepository;
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

  async checkUserHasPassword(userId: number) {
    return !!(
      await this.userRepository.findById(userId, {
        hasPassword: true,
      })
    ).password;
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
