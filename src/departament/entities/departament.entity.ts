import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'departaments' })
@ObjectType()
export class Departament {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Index({ unique: true })
  @Field(() => String)
  name: string;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  createdAt: number;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  updatedAt?: number;

  //* Usuario que crea el registro
  @ManyToOne(() => User, (user) => user.id, { nullable: true, lazy: true })
  // @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;
  // @Column()
  // userId: string;

  // stores
  // user
  // @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  // @Index('userId-index')
  // @Field(() => User)
  // user: User;

  // @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  // @Field(() => [ListItem])
  // listItem: ListItem[];
}
