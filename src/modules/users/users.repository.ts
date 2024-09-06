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
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const [result] = await this.dataSource.query(
      'SELECT * FROM get_user_by_email($1)',
      [email],
    );

    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.dataSource.query('SELECT * FROM get_user_list()');
  }

  async isExist(email: string): Promise<boolean> {
    const [result] = await this.dataSource.query(
      'SELECT * FROM check_user_exist_by_email($1)',
      [email],
    );

    if (!result?.check_user_exist_by_email) return false;
    return true;
  }

  async save(registerDto: RegisterDto) {
    try {
      const { type, email, fullName, password } = registerDto;

      this.logger.log(registerDto);

      if (type === 'user') {
        this.logger.log(`${this.save.name} register user account`);

        const userEntity = new User();
        userEntity.createAt = new Date().toString();
        userEntity.fullName = fullName;
        userEntity.password = password;
        userEntity.email = email;

        this.userRepository.save(userEntity);
      } else if (type === 'employer') {
        this.logger.log(`${this.save.name} register employer account`);

        const { companyName, companyUrl, phoneNumber } = registerDto;

        const userEntity = new User();
        userEntity.id = undefined;
        userEntity.companyName = companyName;
        userEntity.companyUrl = companyUrl;
        userEntity.email = email;
        userEntity.fullName = fullName;
        userEntity.isActive = true;
        userEntity.createAt = null;
        userEntity.createAt = new Date().toString();
        userEntity.password = password;
        userEntity.phoneNumber = phoneNumber;

        // userEntity.jobPosition = await this.jobPositionService.findById(
        //   registerDto.jobPositionsId,
        // );

        // userEntity.role = await this.roleService.findByTitle('employer');

        // const jobFields = await this.jobFieldService.findByIds(
        //   registerDto.jobFieldsIds,
        // );
        // userEntity.usersJobFields = jobFields.map((jobField) => {
        //   let userJobField = new UsersJobField();

        //   userJobField.jobField = jobField;
        //   userJobField.user = userEntity;

        //   return userJobField;
        // });

        console.log('User Entity:', userEntity);

        await this.userRepository.save(userEntity);
      }
    } catch (error: any) {
      this.logger.log(error);
      throw new InternalServerErrorException(
        'Failed to execute stored procedure "register_user"',
      );
    }
  }
}
