import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOneOptions,
  FindOptionsSelect,
  Repository,
  UpdateResult,
} from 'typeorm';

import { ENTITIES } from 'src/common/utils/constants';
import { STATUS_CODE } from 'src/common/utils/enums';
import {
  buildDateRangeFilter,
  buildJsonFieldSearch,
  filterColumns,
  formatParams,
  getPaginationParams,
} from 'src/common/utils/function';
import { CreateApprovalDto } from 'src/dto/approvals/create-approval.dto';
import { UpdateApprovalDto } from 'src/dto/approvals/update-approval.dto';
import { Approval } from 'src/entities/approval.entity';
import { Status } from 'src/entities/status.entity';

@Injectable()
export class ApprovalsRepository {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
  ) {}

  private readonly approvalSelect: FindOptionsSelect<Approval> = filterColumns(
    ENTITIES.FIELDS.APPROVAL,
    ['updateBy', 'updateAt', 'createBy', 'approveBy'],
  );

  private readonly approvalOptions: FindOneOptions<Approval> = {
    relations: ['status', 'approver'],
    select: {
      ...this.approvalSelect,
      approveAt: true,
      approver: {
        id: true,
        fullName: true,
      },
      status: {
        id: true,
        title: true,
        code: true,
      },
    },
  };

  async create(createApprovalDto: ICreate<CreateApprovalDto>) {
    const { createBy, variable, transactionalEntityManager } =
      createApprovalDto;

    const createParams = {
      createAt: new Date().toString(),
      createBy,
      status: variable.status,
      desiredJob: variable.desiredJob,
      desiredJobSnapshot: variable.desiredJob,
    };

    if (transactionalEntityManager)
      return await transactionalEntityManager.save(Approval, createParams);

    return await this.approvalRepository.save(createParams);
  }

  async findAll(approvalQueries: ApprovalQueries) {
    const {
      page,
      pageSize,
      fullName,
      statusId,
      jobFieldId,
      createdDate,
      startAfterOffer,
      totalYearExperience,
    } = approvalQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.approvalRepository.findAndCount({
      where: {
        ...buildJsonFieldSearch({
          entityKey: 'desiredJobSnapshot',
          jsonColumnName: 'desired_job_snapshot',
          filterGroups: {
            startAfterOffer,
            user: { fullName },
            jobField: { id: jobFieldId },
            totalYearExperience: +totalYearExperience,
          },
        }),
        ...buildDateRangeFilter('createAt', createdDate),
        status: { id: statusId },
      },
      order: { createAt: 'DESC' },
      ...this.approvalOptions,
      ...paginationParams,
    });
  }

  async findOne(options: FindOneOptions<Approval>) {
    return await this.approvalRepository.findOne({
      ...options,
      ...this.approvalOptions,
    });
  }

  async approve(
    id: number,
    updateApprovalDto: IUpdate<UpdateApprovalDto & { status: Status }>,
  ) {
    const {
      variable,
      updateBy: approveBy,
      transactionalEntityManager,
    } = updateApprovalDto;

    const updateParams = {
      ...(variable.status && { status: variable.status }),
      ...(variable.rejectReason && { rejectReason: variable.rejectReason }),
      approveAt: new Date().toString(),
      approveBy,
    };

    if (transactionalEntityManager)
      return (
        (
          await (transactionalEntityManager as EntityManager).update(
            Approval,
            id,
            updateParams,
          )
        ).affected > 0
      );

    return (
      (await this.approvalRepository.update(id, updateParams)).affected > 0
    );
  }

  async update(id: number, updateApprovalDto: IUpdate<UpdateApprovalDto>) {
    const { variable, updateBy, transactionalEntityManager } =
      updateApprovalDto;

    const updateParams = {
      ...formatParams(variable),
      updateBy,
      updateAt: new Date().toString(),
    };

    let result = { affected: 0 } as UpdateResult;

    if (transactionalEntityManager)
      result = await (transactionalEntityManager as EntityManager).update(
        Approval,
        id,
        updateParams,
      );
    else result = await this.approvalRepository.update(id, updateParams);

    return result.affected > 0;
  }

  async findPendingApproval(id: number) {
    return await this.approvalRepository.findOne({
      where: {
        desiredJob: { id },
        status: { code: STATUS_CODE.APPROVAL_PENDING },
      },
      relations: ['status'],
      select: { id: true, status: { id: true, code: true } },
    });
  }
}
