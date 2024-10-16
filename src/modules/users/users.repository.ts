import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsSelect, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { ISaveUserParams } from 'src/common/utils/types/user';
import { UpdateAccountInfoDto } from 'src/dto/users/update-accounnt-info.dto';
import { JobCategory } from 'src/entities/job_category.entity';
import { JobField } from 'src/entities/job_field.entity';
import { JobPosition } from 'src/entities/job_position.entity';
import { Placement } from 'src/entities/placement.entity';
import { User } from 'src/entities/user.entity';
import { UsersForeignLanguage } from 'src/entities/users_foreign_language.entity';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { JobFieldsService } from 'src/services/job_fields.service';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UsersJobField)
    private readonly usersJobFieldRepository: Repository<UsersJobField>,
  ) {}

  private readonly logger = new Logger(`API-Gateway.${UsersRepository.name}`);

  private userRelations = {
    entities: [
      'role',
      'jobPosition',
      'userSkills',
      'achivement',
      'userLanguages',
      'workExperiences',
      'curriculumVitae',
      'userSkills.skill',
      'userLanguages.foreignLanguage',
      'workExperiences.placement',
      'workExperiences.jobPosition',
      'workExperiences.jobCategory',
    ],
    fields: [
      filterColumns(ENTITIES.FIELDS.ROLE, removeColumns),
      filterColumns(ENTITIES.FIELDS.JOB_POSITION, removeColumns),
      filterColumns(ENTITIES.FIELDS.USER_SKILLS, removeColumns),
      filterColumns(ENTITIES.FIELDS.ACHIVEMENT, removeColumns),
      filterColumns(ENTITIES.FIELDS.USERS_FOREIGN_LANGUAGE, removeColumns),
      filterColumns(ENTITIES.FIELDS.WORK_EXPERIENCE, removeColumns),
      filterColumns(ENTITIES.FIELDS.CURRICULUM_VITAE, removeColumns),
    ],
  };

  private readonly userFields = filterColumns(ENTITIES.FIELDS.USER, [
    ...removeColumns,
    'password',
  ]) as FindOptionsSelect<User>;
  private foreignLanguageSelectedFields = filterColumns(
    ENTITIES.FIELDS.FOREIGN_LANGUAGE,
    removeColumns,
  ) as FindOptionsSelect<UsersForeignLanguage>;
  private readonly placementFields = filterColumns(
    ENTITIES.FIELDS.PLACEMENT,
    removeColumns,
  ) as FindOptionsSelect<Placement>;
  private readonly positionFields = filterColumns(
    ENTITIES.FIELDS.JOB_POSITION,
    removeColumns,
  ) as FindOptionsSelect<JobPosition>;
  private readonly jobCategoryFields = filterColumns(
    ENTITIES.FIELDS.JOB_CATEGORY,
    removeColumns,
  ) as FindOptionsSelect<JobCategory>;
  private skillSelectedFields = filterColumns(
    ENTITIES.FIELDS.FOREIGN_LANGUAGE,
    removeColumns,
  ) as FindOptionsSelect<UsersForeignLanguage>;
  private usersJobFieldsFields = filterColumns(
    ENTITIES.FIELDS.USERS_JOB_FIELD,
    removeColumns,
  ) as FindOptionsSelect<UsersJobField>;
  private jobFieldsFields = filterColumns(
    ENTITIES.FIELDS.JOB_FIELD,
    removeColumns,
  ) as FindOptionsSelect<JobField>;

  private userSelectedRelations = this.userRelations.entities.reduce(
    (acc, entity, index) => {
      acc[entity] = this.userRelations.fields[index];
      return acc;
    },
    {},
  ) as any;

  private readonly userSelectColumns = {
    ...this.userSelectedRelations,
    ...this.userFields,
    userSkills: {
      ...this.userSelectedRelations.userSkills,
      skill: this.skillSelectedFields,
    },
    userLanguages: {
      ...this.userSelectedRelations.userLanguages,
      foreignLanguage: this.foreignLanguageSelectedFields,
    },
    workExperiences: {
      ...this.userSelectedRelations.workExperiences,
      placement: this.placementFields,
      jobPosition: this.positionFields,
      jobCategory: this.jobCategoryFields,
    },
  };

  private generateRelationshipOptionals(
    options: IGenerateRelationshipOptional = {},
  ) {
    const { hasPassword = false, hasRelations = true, relationships } = options;

    return {
      relations: hasRelations
        ? !relationships
          ? this.userRelations.entities
          : relationships
        : ['role', 'jobPosition'],
      ...(hasRelations
        ? {
            select: { ...this.userSelectColumns, password: hasPassword },
          }
        : {
            select: {
              role: this.userSelectColumns.role,
              jobPosition: this.userSelectColumns.jobPosition,
              ...this.userFields,
              password: hasPassword,
            },
          }),
    };
  }

  async findByEmail(
    email: string,
    options?: IGenerateRelationshipOptional,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email },
      ...this.generateRelationshipOptionals(options),
    });
  }

  async findById(
    id: number,
    options?: IGenerateRelationshipOptional,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: id },
      ...this.generateRelationshipOptionals(options),
    });
  }

  async findAll(
    userQueries: IUserQueries,
  ): Promise<[Omit<User, 'password'>[], number]> {
    const { jobFieldsId, jobPositionsId, page, pageSize } = userQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    return this.userRepository.findAndCount({
      where: {
        usersJobFields: {
          ...(jobFieldsId && { jobFieldsId: +jobFieldsId }),
        },
        jobPosition: {
          ...(jobPositionsId && { id: +jobPositionsId }),
        },
      },
      ...paginationParams,
      ...this.generateRelationshipOptionals({
        relationships: [
          'role',
          'usersJobFields',
          'jobPosition',
          'usersJobFields.jobField',
        ],
        select: {
          ...this.userFields,
          password: false,
          role: this.userSelectColumns.role,
          jobPosition: this.userSelectColumns.jobPosition,
          usersJobFields: {
            ...this.usersJobFieldsFields,
            jobField: { ...this.jobFieldsFields },
          },
        },
      } as IGenerateRelationshipOptional<User>),
    });
  }

  async isExist(email: string): Promise<boolean> {
    return (await this.userRepository.countBy({ email })) > 0;
  }

  async save(saveUserParams: ISaveUserParams): Promise<User> {
    try {
      const { role, email, fullName, password } = saveUserParams;
      let newUserRecord: User | null = null;

      if (!role) return null;

      if (role.title === 'admin') {
        this.logger.log(`${this.save.name} register admin account`);

        newUserRecord = await this.userRepository.save({
          createAt: new Date().toString(),
          fullName: fullName,
          password: password,
          email: email,
          phoneNumber: saveUserParams.phoneNumber,
          role: role,
        });
      } else if (role.title === 'employer') {
        this.logger.log(`${this.save.name} register employer account`);

        const { companyName, companyUrl, phoneNumber, jobPosition } =
          saveUserParams;

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
              role,
              jobPosition,
            });

            const jobFields = await this.jobFieldService.findByIds(
              saveUserParams.jobFieldsIds,
            );

            await transactionalEntityManager.save(
              UsersJobField,
              jobFields.map((jobField) => {
                return this.usersJobFieldRepository.create({
                  jobFieldsId: jobField.id,
                  jobField: jobField,
                  user: newUserRecord,
                  usersId: newUserRecord.id,
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

  async changePassword(params: { id: number; password: string }) {
    const { id, password } = params;

    const result = await this.userRepository.update(
      { id },
      {
        password,
        updateAt: new Date().toString(),
        updateBy: id,
      },
    );

    return result.affected > 0;
  }

  async updateAccountInfo(updateAccountInfoDto: IUpdate<UpdateAccountInfoDto>) {
    const { updateBy, variable } = updateAccountInfoDto;

    const result = await this.userRepository.update(updateBy, {
      ...(variable.isChangePassword &&
        variable?.newPassword && { password: variable.newPassword }),
      ...(variable?.fullName && { fullName: variable.fullName }),
      updateAt: new Date().toString(),
      updateBy,
    });

    return result.affected > 0;
  }
}
