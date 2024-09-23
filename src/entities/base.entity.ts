import { Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

import { Field } from 'src/common/decorators/field.decorator';

export class BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'int', nullable: true, name: 'create_by' })
  createBy: number;

  @Field()
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'create_at',
  })
  createAt: Timestamp | string;

  @Field()
  @Column({ type: 'int', nullable: true, name: 'update_by' })
  updateBy: number;

  @Field()
  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'update_at',
  })
  updateAt: Timestamp | string;
}
