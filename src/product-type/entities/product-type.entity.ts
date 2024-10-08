import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Product } from 'src/product/entities';
import { User } from 'src/user/entities';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'producttypes' })
@ObjectType()
export class ProductType {
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
  @OneToMany(() => Product, (product) => product.productTypeOne, { lazy: true })
  @Field(() => [Product])
  products: Product[];

  //* Usuario que crea el registro
  @ManyToOne(() => User, (user) => user.id, { nullable: true, lazy: true })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;
}
