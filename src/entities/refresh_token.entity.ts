import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum REFRESH_TOKEN_STATUS {
  INVALID = 'in valid',
  VALID = 'valid',
}

@Entity({ name: 'refresh_token' })
export class RefreshToken extends BaseEntity {
  @Column({ type: 'varchar', length: 500, name: 'refresh_token' })
  refreshToken: string;

  @Column({ type: 'timestamp without time zone', name: 'expires_at' })
  expiresAt: string;

  @Column({ type: 'varchar', length: 10, enum: REFRESH_TOKEN_STATUS })
  status: REFRESH_TOKEN_STATUS;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
