import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities';
import { ProductType } from 'src/product-type/entities';
import { ProductContained } from 'src/product-contained/entities';

@Entity({ name: 'products' })
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  //* TypodeProductos que de producto
  @ManyToOne(() => ProductType, (pType) => pType.products, { lazy: true })
  @Field(() => ProductType)
  productTypeOne: ProductType;

  @Column()
  @Index({ unique: true })
  @Field(() => String)
  name: string;

  @Column()
  @Index({ unique: false })
  @Field(() => String)
  serial: string;

  @Column()
  @Field(() => String)
  color?: string;

  @Column()
  @Field(() => String)
  mark?: string;

  @Column()
  @Field(() => String)
  model?: string;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  // //* Usuario que crea el registro
  @OneToMany(() => ProductContained, (contained) => contained.product, { nullable: true, lazy: true })
  // @Field(() => ProductContained, { nullable: true })
  contained: ProductContained[];

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
