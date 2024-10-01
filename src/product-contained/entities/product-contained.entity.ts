import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Product } from 'src/product/entities';
import { User } from 'src/user/entities';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'productContaineds' })
@ObjectType()
export class ProductContained {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  //* TypodeProductos que de producto
  @ManyToOne(() => Product, (product) => product.id, { lazy: true })
  @Index('product-idx', { unique: false })
  @Field(() => Product)
  product: Product;

  @ManyToOne(() => Product, (product) => product.id, { lazy: true })
  @Index('contained-idx', { unique: true })
  @Field(() => Product)
  contained: Product;

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
