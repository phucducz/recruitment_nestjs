import { Injectable } from '@nestjs/common';

import { CreateProvinceDto } from 'src/dto/provinces/create-province.dto';
import { UpdateProvinceDto } from 'src/dto/provinces/update-province.dto';

@Injectable()
export class ProvincesService {
  create(createProvinceDto: CreateProvinceDto) {
    return 'This action adds a new province';
  }

  findAll() {
    return `This action returns all provinces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
