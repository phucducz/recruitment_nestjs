import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { User } from 'src/entities/user.entity';
import { UsersJobField } from 'src/entities/users_job_field.entity';
import { JobFieldsService } from 'src/services/job_fields.service';
import { JobPositionsService } from 'src/services/job_positions.service';
import { RolesService } from 'src/services/roles.service';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(`API-Gateway.${UsersRepository.name}`);

  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(JobPositionsService)
    @Inject(JobPositionsService)
    private readonly jobPositionService: JobPositionsService,
    @Inject(RolesService) private readonly roleService: RolesService,
    @Inject(JobFieldsService)
    private readonly jobFieldService: JobFieldsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UsersJobField)
    private readonly usersJobFieldRepository: Repository<UsersJobField>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userRepository.find();
  }

  async isExist(email: string): Promise<boolean> {
    return (await this.userRepository.countBy({ email })) > 0;
  }

  async save(registerDto: RegisterDto) {
    try {
      const { type, email, fullName, password } = registerDto;

      if (type === 'user') {
        this.logger.log(`${this.save.name} register user account`);

        this.userRepository.save({
          createAt: new Date().toString(),
          fullName: fullName,
          password: password,
          email: email,
        });
      } else if (type === 'employer') {
        this.logger.log(`${this.save.name} register employer account`);

        const { companyName, companyUrl, phoneNumber } = registerDto;

        await this.dataSource.manager.transaction(
          async (transactionalEntityManager) => {
            const newUserRecord = await transactionalEntityManager.save(User, {
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
              role: await this.roleService.findByTitle('employer'),
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
      }
    } catch (error: any) {
      this.logger.log(error);
      throw new InternalServerErrorException(
        'Failed to execute stored procedure "register_user"',
      );
    }
  }
}
