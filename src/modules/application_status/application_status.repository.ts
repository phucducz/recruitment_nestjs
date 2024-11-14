import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getPaginationParams } from 'src/common/utils/function';
import { ApplicationStatus } from 'src/entities/application_status.entity';

@Injectable()
export class ApplicationStatusRepository {
  constructor(
    @InjectRepository(ApplicationStatus)
    private readonly applicationStatusRepository: Repository<ApplicationStatus>,
  ) {}

  async findAll(findAllQueries: IFindApplicationStatusQueries) {
    const { statusId } = findAllQueries;
    const paginationParams = getPaginationParams({
      page: +findAllQueries.page,
      pageSize: +findAllQueries.pageSize,
    });

    return await this.applicationStatusRepository.findAndCount({
      where: {
        ...(statusId && { id: +statusId }),
      },
      ...paginationParams,
      order: { id: 'ASC' },
    });
  }

  async findById(id: number) {
    return await this.applicationStatusRepository.findOneBy({ id });
  }

  async findByTitle(title: string) {
    return await this.applicationStatusRepository.findOneBy({ title });
  }
}
