import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

import { ENTITIES, removeColumns } from 'src/common/utils/constants';
import { filterColumns, getPaginationParams } from 'src/common/utils/function';
import { CreateWorkExperienceDto } from 'src/dto/work_experiences/create-work_experience.dto';
import { UpdateWorkExperienceDto } from 'src/dto/work_experiences/update-work_experience.dto';
import { WorkExperience } from 'src/entities/work_experience.entity';

@Injectable()
export class WorkExperiencesRepository {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
  ) {}

  async create(
    createWorkExperienceDto: ICreate<
      CreateWorkExperienceDto &
        Pick<
          WorkExperience,
          'jobCategory' | 'jobPosition' | 'placement' | 'user'
        >
    >,
  ) {
    const { createBy, variable } = createWorkExperienceDto;

    return (await this.workExperienceRepository.save({
      companyName: variable.companyName,
      createAt: new Date().toString(),
      createBy,
      description: variable.description,
      endDate: variable.endDate,
      isWorking: variable.endDate === null,
      startDate: variable.startDate,
      jobCategory: variable.jobCategory,
      jobPosition: variable.jobPosition,
      placement: variable.placement,
      user: variable.user,
    })) as WorkExperience;
  }

  async remove(id: number) {
    const result = await this.workExperienceRepository.delete(id);

    return result.affected > 0;
  }

  async update(
    id: number,
    updateWorkExperienceDto: IUpdate<
      UpdateWorkExperienceDto &
        Partial<
          Pick<WorkExperience, 'jobCategory' | 'jobPosition' | 'placement'>
        >
    >,
  ) {
    const { updateBy, variable } = updateWorkExperienceDto;

    const result = await this.workExperienceRepository.update(id, {
      companyName: variable.companyName,
      description: variable.description,
      endDate: variable.endDate,
      isWorking: variable.endDate === null,
      jobCategory: variable.jobCategory,
      jobPosition: variable.jobPosition,
      placement: variable.placement,
      startDate: variable.startDate,
      updateBy,
      updateAt: new Date().toString(),
    });

    return result.affected > 0;
  }

  async findBy(workExperienceQueries: IFindWorkExperiencesQueries) {
    const { id, usersId, page, pageSize } = workExperienceQueries;
    const paginationParams = getPaginationParams({
      page: +page,
      pageSize: +pageSize,
    });

    return await this.workExperienceRepository.findAndCount({
      where: {
        ...(id && { id: +id }),
        ...(usersId && { user: { id: +usersId } }),
      } as FindOptionsWhere<WorkExperience>,
      relations: ['jobCategory', 'jobPosition', 'placement'],
      select: {
        ...filterColumns(ENTITIES.FIELDS.WORK_EXPERIENCE, removeColumns),
        jobCategory: filterColumns(ENTITIES.FIELDS.JOB_CATEGORY, removeColumns),
        jobPosition: filterColumns(ENTITIES.FIELDS.JOB_POSITION, removeColumns),
        placement: filterColumns(ENTITIES.FIELDS.PLACEMENT, removeColumns),
      } as FindOptionsSelect<WorkExperience>,
      ...paginationParams,
    });
  }
}
