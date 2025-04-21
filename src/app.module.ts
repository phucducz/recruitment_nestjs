import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import 'reflect-metadata';

const envModule = ConfigModule.forRoot({
  isGlobal: true,
});

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchivementsModule } from './modules/achivements/achivements.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CurriculumVitaesModule } from './modules/curriculum_vitaes/curriculum_vitaes.module';
import { DesiredJobsModule } from './modules/desired_jobs/desired_jobs.module';
import { DesiredJobsPlacementsModule } from './modules/desired_jobs_placements/desired_jobs_placements.module';
import { DesiredJobsPositionsModule } from './modules/desired_jobs_positions/desired_jobs_positions.module';
import { ForeignLanguagesModule } from './modules/foreign_languages/foreign_languages.module';
import { FunctionalGroupsModule } from './modules/functional_groups/functional_groups.module';
import { FunctionalsModule } from './modules/functionals/functionals.module';
import { JobCategoriesModule } from './modules/job_categories/job_categories.module';
import { JobFieldsModule } from './modules/job_fields/job_fields.module';
import { JobPositionsModule } from './modules/job_positions/job_positions.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { JobsPlacementsModule } from './modules/jobs_placements/jobs_placements.module';
import { MailModule } from './modules/mail/mail.module';
import { MenuViewGroupsModule } from './modules/menu_view_groups/menu_view_groups.module';
import { MenuViewsModule } from './modules/menu_views/menu_views.module';
import { OTPModule } from './modules/otp/otp.module';
import { PlacementsModule } from './modules/placements/placements.module';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { RedisModule } from './modules/redis/redis.module';
import { RefreshTokenModule } from './modules/refresh_token/refresh_token.module';
import { ResetPasswordModule } from './modules/reset_password/reset_password.module';
import { RolesModule } from './modules/roles/roles.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { SkillsModule } from './modules/skills/skills.module';
import { StatusModule } from './modules/status/status.module';
import { StatusTypesModule } from './modules/status_types/status_types.module';
import { UsersModule } from './modules/users/users.module';
import { UsersForeignLanguagesModule } from './modules/users_foreign_languages/users_foreign_languages.module';
import { UsersJobFieldsModule } from './modules/users_job_fields/users_job_fields.module';
import { UsersJobsModule } from './modules/users_jobs/users_jobs.module';
import { UsersSkillsModule } from './modules/users_skills/users_skills.module';
import { WorkExperiencesModule } from './modules/work_experiences/work_experiences.module';
import { WorkTypesModule } from './modules/work_types/work_types.module';

@Module({
  imports: [
    envModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        ssl: {
          rejectUnauthorized: false,
          require: true, // Thêm dòng này nếu cần thiết
        },
        synchronize: true,
        autoLoadEntities: true,
        connectTimeoutMS: 30000,
      }),
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    UsersModule,
    RolesModule,
    JobPositionsModule,
    SkillsModule,
    UsersSkillsModule,
    ForeignLanguagesModule,
    UsersForeignLanguagesModule,
    AchivementsModule,
    WorkExperiencesModule,
    WorkTypesModule,
    PlacementsModule,
    JobsModule,
    JobCategoriesModule,
    JobFieldsModule,
    UsersJobFieldsModule,
    JobsPlacementsModule,
    UsersJobsModule,
    AuthModule,
    ProvincesModule,
    RefreshTokenModule,
    MailModule,
    OTPModule,
    ResetPasswordModule,
    CloudinaryModule,
    CurriculumVitaesModule,
    DesiredJobsModule,
    DesiredJobsPlacementsModule,
    DesiredJobsPositionsModule,
    SchedulesModule,
    StatusModule,
    StatusTypesModule,
    FunctionalGroupsModule,
    FunctionalsModule,
    AdminModule,
    MenuViewsModule,
    MenuViewGroupsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
