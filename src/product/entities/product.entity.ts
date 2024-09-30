import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities';
import { ProductType } from 'src/product-type/entities';

@Entity({ name: 'products' })
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  //* TypodeProductos que de producto
  @ManyToOne(() => ProductType, (pType) => pType.id, { nullable: true, lazy: true })
  @Field(() => ProductType, { nullable: true })
  productType?: ProductType;

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

  @ManyToOne(() => Product, (product) => product.id, { nullable: true, lazy: true })
  @JoinColumn({ name: 'containedIn' })
  @Field(() => Product, { nullable: true })
  containedIn?: Product;

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
