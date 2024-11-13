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
import { UpdatePersonalInfoDto } from 'src/dto/users/update-personal-info.dto';
import { DesiredJob } from 'src/entities/desired_job.entity';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { DataSource } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { DesiredJobsService } from './desired_jobs.service';
import { JobFieldsService } from './job_fields.service';
import { JobPositionsService } from './job_positions.service';
import { PlacementsService } from './placements.service';
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
    const desiredJob = await this.desiredJobService.findOneBy({
      where: { user: { id } },
    });
    const result = await this.userRepository.findById(id, options);

    return {
      ...result,
      desiredJob: {
        totalYearExperience: desiredJob?.totalYearExperience ?? null,
      } as DesiredJob,
    };
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
      UpdateAccountInfoDto & { file: Express.Multer.File }
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
            variable: { totalYearExperience: variable.totalYearExperience },
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
              variable.jobPositionsId,
            ),
          }),
          ...(variable.placementsId && {
            placement: await this.placementsService.findById(
              variable.placementsId,
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
                variable.jobPositionsId,
              ),
            }),
            ...(variable.placementsId && {
              placement: await this.placementsService.findById(
                variable.placementsId,
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
