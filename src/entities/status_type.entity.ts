import { Column, Entity, OneToMany } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';
import { BaseEntity } from './base.entity';
import { Status } from './status.entity';

@Entity({ name: 'status_types' })
export class StatusType extends BaseEntity {
  @Field()
  @Column({ type: 'varchar' })
  title: string;

  @OneToMany(() => Status, (status) => status.statusType)
  status: Status[];
}
