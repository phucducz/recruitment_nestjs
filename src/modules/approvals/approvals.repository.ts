import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getPaginationParams } from 'src/common/utils/function';
import { CreateApprovalDto } from 'src/dto/approvals/create-approval.dto';
import { Approval } from 'src/entities/approval.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApprovalsRepository {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
  ) {}

  async create(createApprovalDto: ICreate<CreateApprovalDto>) {
    const { createBy, variable, transactionalEntityManager } =
      createApprovalDto;
    const createParams = {
      createAt: new Date().toString(),
      createBy,
      status: variable.status,
      desiredJob: variable.desiredJob,
      rejectReason: variable.rejectReason,
    };

    if (transactionalEntityManager)
      return await transactionalEntityManager.save(Approval, createParams);

    return await this.approvalRepository.save(createParams);
  }

  async findAll(approvalQueries: ApprovalQueries) {
    console.log('approvalQueries', approvalQueries);

    const { page, pageSize } = approvalQueries;
    const paginationParams = getPaginationParams({ page, pageSize });

    return await this.approvalRepository.findAndCount({
      where: {},
      order: { createAt: 'DESC' },
      ...paginationParams,
    });
  }
}
