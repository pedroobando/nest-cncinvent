import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'proyects' })
@ObjectType()
export class Proyect {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Index({ unique: true })
  @Field(() => Int)
  code: number;

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
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;
}
