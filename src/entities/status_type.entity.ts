import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { STATUS_TYPE_CODES } from 'src/common/utils/enums';
import { BaseEntity } from './base.entity';
import { Status } from './status.entity';

@Entity({ name: 'status_types' })
export class StatusType extends BaseEntity {
  @Field()
  @Column({ type: 'varchar' })
  title: string;

  @Field()
  @Column({ type: 'varchar', enum: STATUS_TYPE_CODES, nullable: true })
  code: string;

  @OneToMany(() => Status, (status) => status.statusType)
  status: Status[];
}
