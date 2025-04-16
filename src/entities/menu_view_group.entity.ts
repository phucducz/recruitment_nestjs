import { Field } from 'src/common/decorators/field.decorator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuViews } from './menu_views.entity';
import { User } from './user.entity';

@Entity({ name: 'menu_view_groups' })
export class MenuViewGroup extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Field()
  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Field()
  @Column({ name: 'order_index', type: 'int', nullable: true, default: 0 })
  orderIndex: number;

  @OneToMany(() => MenuViews, (menuView) => menuView.group)
  menuViews: MenuViews[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'update_by' })
  updater: User;
}
