import { Inject, Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

import { CreateApprovalDto } from 'src/dto/approvals/create-approval.dto';
import { UpdateApprovalDto } from 'src/dto/approvals/update-approval.dto';
import { Approval } from 'src/entities/approval.entity';
import { ApprovalsRepository } from 'src/modules/approvals/approvals.repository';
import { StatusRepository } from 'src/modules/status/status.repository';

@Injectable()
export class ApprovalsService {
  constructor(
    @Inject(ApprovalsRepository)
    private readonly approvalsRepository: ApprovalsRepository,
    @Inject(StatusRepository)
    private readonly statusRepository: StatusRepository,
  ) {}

  async create(createApprovalDto: ICreate<CreateApprovalDto>) {
    return await this.approvalsRepository.create(createApprovalDto);
  }

  async findAll(approvalQueries: ApprovalQueries) {
    return await this.approvalsRepository.findAll(approvalQueries);
  }

  async approve(id: number, updateApprovalDto: IUpdate<UpdateApprovalDto>) {
    const { variable } = updateApprovalDto;
    const status = await this.statusRepository.findByCode(variable.code);

    return await this.approvalsRepository.approve(id, {
      ...updateApprovalDto,
      variable: { ...variable, status },
    });
  }

  async findOne(options: FindOneOptions<Approval>) {
    return await this.approvalsRepository.findOne(options);
  }

  update(id: number, updateApprovalDto: UpdateApprovalDto) {
    return `This action updates a #${id} approval`;
  }

  remove(id: number) {
    return `This action removes a #${id} approval`;
  }
}
