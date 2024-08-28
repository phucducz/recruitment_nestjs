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
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { JobPositionsModule } from './job_positions/job_positions.module';
import { SkillsModule } from './skills/skills.module';
import { UsersSkillsModule } from './users_skills/users_skills.module';
import { ForeignLanguagesModule } from './foreign_languages/foreign_languages.module';
import { UsersForeignLanguagesModule } from './users_foreign_languages/users_foreign_languages.module';
import { AchivementsModule } from './achivements/achivements.module';
import { WorkExperiencesModule } from './work_experiences/work_experiences.module';
import { WorkTypesModule } from './work_types/work_types.module';
import { PlacementsModule } from './placements/placements.module';
import { JobsModule } from './jobs/jobs.module';
import { JobCategoriesModule } from './job_categories/job_categories.module';
import { JobFieldsModule } from './job_fields/job_fields.module';
import { UsersJobFieldsModule } from './users_job_fields/users_job_fields.module';
import { JobsPlacementsModule } from './jobs_placements/jobs_placements.module';
import { UsersJobsModule } from './users_jobs/users_jobs.module';

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
        synchronize: true,
        autoLoadEntities: true,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
