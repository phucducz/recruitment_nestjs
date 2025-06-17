import { Inject, Injectable } from '@nestjs/common';
import { CreateApprovalDto } from 'src/dto/approvals/create-approval.dto';
import { UpdateApprovalDto } from 'src/dto/approvals/update-approval.dto';
import { Approval } from 'src/entities/approval.entity';
import { ApprovalsRepository } from 'src/modules/approvals/approvals.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ApprovalsService {
  constructor(
    @Inject(ApprovalsRepository)
    private readonly approvalsRepository: ApprovalsRepository,
  ) {}

  async create(createApprovalDto: ICreate<CreateApprovalDto>) {
    return await this.approvalsRepository.create(createApprovalDto);
  }

  async findAll(approvalQueries: ApprovalQueries) {
    return await this.approvalsRepository.findAll(approvalQueries);
  }

  findOne(id: number) {
    return `This action returns a #${id} approval`;
  }

  update(id: number, updateApprovalDto: UpdateApprovalDto) {
    return `This action updates a #${id} approval`;
  }

  remove(id: number) {
    return `This action removes a #${id} approval`;
  }
}
