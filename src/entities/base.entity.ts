import { Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, name: 'create_by' })
  createBy: number;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'create_at',
  })
  createAt: Timestamp | string;

  @Column({ type: 'int', nullable: true, name: 'update_by' })
  updateBy: number;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'update_at',
  })
  updateAt: Timestamp | string;
}
