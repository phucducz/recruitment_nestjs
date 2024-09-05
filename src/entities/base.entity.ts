import { Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  create_by: number;

  @Column({ type: 'timestamp without time zone', nullable: true })
  create_at: Timestamp;

  @Column({ type: 'int', nullable: true })
  update_by: number;

  @Column({ type: 'timestamp without time zone', nullable: true })
  update_at: Timestamp;
}
