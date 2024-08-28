import { Injectable } from '@nestjs/common';
import { CreateJobFieldDto } from './dto/create-job_field.dto';
import { UpdateJobFieldDto } from './dto/update-job_field.dto';

@Injectable()
export class JobFieldsService {
  create(createJobFieldDto: CreateJobFieldDto) {
    return 'This action adds a new jobField';
  }

  findAll() {
    return `This action returns all jobFields`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobField`;
  }

  update(id: number, updateJobFieldDto: UpdateJobFieldDto) {
    return `This action updates a #${id} jobField`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobField`;
  }
}
