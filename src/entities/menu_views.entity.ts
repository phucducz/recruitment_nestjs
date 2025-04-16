import { Field } from 'src/common/decorators/field.decorator';
import { ICON_TYPE } from 'src/common/utils/enums';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Functional } from './functional.entity';
import { MenuViewGroup } from './menu_view_group.entity';

@Entity({ name: 'menu_views' })
export class MenuViews extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Field()
  @Column({
    length: 50,
    nullable: true,
    type: 'varchar',
    name: 'icon_type',
    default: ICON_TYPE.BUILT_IN,
    enum: [ICON_TYPE.IMAGE, ICON_TYPE.BUILT_IN],
  })
  iconType: string;

  @Field()
  @Column({ type: 'varchar', length: 200, nullable: true })
  icon: string;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: true })
  path: string;

  @Field()
  @Column({ name: 'order_index', type: 'int', nullable: true, default: 0 })
  orderIndex: number;

  @OneToMany(() => Functional, (functional) => functional.menu)
  functionals: Functional[];

  @ManyToOne(() => MenuViewGroup, (group) => group.menuViews)
  @JoinColumn({ name: 'menu_view_group_id', referencedColumnName: 'id' })
  group: MenuViewGroup;
}
