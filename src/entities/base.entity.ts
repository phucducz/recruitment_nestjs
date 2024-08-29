import { Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  create_by: number;

  @Column({ type: 'timestamp without time zone' })
  create_at: Timestamp;

  @Column({ type: 'int' })
  update_by: number;

  @Column({ type: 'timestamp without time zone' })
  update_at: Timestamp;
}
