import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsSelect, Repository } from 'typeorm';

import { ENTITIES } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { Placement } from 'src/entities/placement.entity';
import { User } from 'src/entities/user.entity';
import { UsersForeignLanguage } from 'src/entities/users_foreign_language.entity';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { JobFieldsService } from 'src/services/job_fields.service';
import { JobPositionsService } from 'src/services/job_positions.service';
import { RolesService } from 'src/services/roles.service';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(forwardRef(() => JobPositionsService))
    private readonly jobPositionService: JobPositionsService,
    @Inject(RolesService) private readonly roleService: RolesService,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UsersJobField)
    private readonly usersJobFieldRepository: Repository<UsersJobField>,
  ) {}

  private readonly logger = new Logger(`API-Gateway.${UsersRepository.name}`);

  private readonly removeColumns = [
    'createAt',
    'createBy',
    'updateAt',
    'updateBy',
  ];

  private userRelations = {
    entities: [
      'role',
      'jobPosition',
      'userSkills',
      'achivement',
      'userLanguages',
      'workExperiences',
      'userSkills.skill',
      'userLanguages.foreignLanguage',
      'workExperiences.placement',
      'workExperiences.jobPosition',
      'workExperiences.jobCategory',
    ],
    fields: [
      filterColumns(ENTITIES.FIELDS.ROLE, this.removeColumns),
      filterColumns(ENTITIES.FIELDS.JOB_POSITION, this.removeColumns),
      filterColumns(ENTITIES.FIELDS.USER_SKILLS, [...this.removeColumns, 'id']),
      filterColumns(ENTITIES.FIELDS.ACHIVEMENT, this.removeColumns),
      filterColumns(ENTITIES.FIELDS.USERS_FOREIGN_LANGUAGE, this.removeColumns),
      filterColumns(ENTITIES.FIELDS.WORK_EXPERIENCE, this.removeColumns),
    ],
  };

  private readonly userFields = filterColumns(ENTITIES.FIELDS.USER, [
    ...this.removeColumns,
    'password',
  ]) as FindOptionsSelect<User>;
  private foreignLanguageSelectedFields = filterColumns(
    ENTITIES.FIELDS.FOREIGN_LANGUAGE,
    this.removeColumns,
  ) as FindOptionsSelect<UsersForeignLanguage>;
  private readonly placementFields = filterColumns(
    ENTITIES.FIELDS.PLACEMENT,
    this.removeColumns,
  ) as FindOptionsSelect<Placement>;
  private readonly positionFields = filterColumns(
    ENTITIES.FIELDS.JOB_POSITION,
    this.removeColumns,
  ) as FindOptionsSelect<JobPosition>;
  private readonly jobCategoryFields = filterColumns(
    ENTITIES.FIELDS.JOB_CATEGORY,
    this.removeColumns,
  ) as FindOptionsSelect<JobCategory>;

  private userSelectedFields = this.userRelations.entities.reduce(
    (acc, entity, index) => {
      acc[entity] = this.userRelations.fields[index];
      return acc;
    },
    {},
  ) as any;

  private skillSelectedFields = filterColumns(
    ENTITIES.FIELDS.FOREIGN_LANGUAGE,
    this.removeColumns,
  ) as FindOptionsSelect<UsersForeignLanguage>;

  private readonly userSelectColumns = {
    ...this.userSelectedFields,
    ...this.userFields,
    userSkills: {
      ...this.userSelectedFields.userSkills,
      skill: this.skillSelectedFields,
    },
    userLanguages: {
      ...this.userSelectedFields.userLanguages,
      foreignLanguage: this.foreignLanguageSelectedFields,
    },
    workExperiences: {
      ...this.userSelectedFields.workExperiences,
      placement: this.placementFields,
      jobPosition: this.positionFields,
      jobCategory: this.jobCategoryFields,
    },
  };

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email },
      relations: this.userRelations.entities,
      select: this.userSelectColumns,
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: this.userRelations.entities,
      select: this.userSelectColumns,
    });
  }

  async findAll(
    pagination: IPagination,
  ): Promise<[Omit<User, 'password'>[], number]> {
    const paginationParams = getPaginationParams(pagination);

    return this.userRepository.findAndCount({
      ...paginationParams,
      relations: this.userRelations.entities,
      select: this.userSelectColumns,
    });
  }

  async isExist(email: string): Promise<boolean> {
    return (await this.userRepository.countBy({ email })) > 0;
  }

  async save(registerDto: RegisterDto): Promise<User> {
    try {
      const { roleId, email, fullName, password } = registerDto;
      let newUserRecord: User | null = null;

      const role = await this.roleService.findById(roleId);
      if (!role) return null;

      if (role.title === 'admin') {
        this.logger.log(`${this.save.name} register admin account`);

        newUserRecord = await this.userRepository.save({
          createAt: new Date().toString(),
          fullName: fullName,
          password: password,
          email: email,
          phoneNumber: registerDto.phoneNumber,
          role: role,
        });
      } else if (role.title === 'employer') {
        this.logger.log(`${this.save.name} register employer account`);

        const { companyName, companyUrl, phoneNumber } = registerDto;

        await this.dataSource.manager.transaction(
          async (transactionalEntityManager) => {
            newUserRecord = await transactionalEntityManager.save(User, {
              id: undefined,
              companyName: companyName,
              companyUrl: companyUrl,
              email: email,
              fullName: fullName,
              isActive: true,
              createAt: new Date().toString(),
              password: password,
              phoneNumber: phoneNumber,
              jobPosition: await this.jobPositionService.findById(
                registerDto.jobPositionsId,
              ),
              role,
            });

            const jobFields = await this.jobFieldService.findByIds(
              registerDto.jobFieldsIds,
            );

            await transactionalEntityManager.save(
              UsersJobField,
              jobFields.map((jobField) => {
                return this.usersJobFieldRepository.create({
                  job_fields_id: jobField.id,
                  jobField: jobField,
                  user: newUserRecord,
                  users_id: newUserRecord.id,
                });
              }),
            );
          },
        );
      } else {
        this.logger.log(`${this.save.name} register user account`);

        newUserRecord = await this.userRepository.save({
          createAt: new Date().toString(),
          fullName: fullName,
          password: password,
          email: email,
          role: role,
        });
      }

      return newUserRecord;
    } catch (error: any) {
      this.logger.log(error);
      throw new InternalServerErrorException('Failed to register account');
    }
  }
}
