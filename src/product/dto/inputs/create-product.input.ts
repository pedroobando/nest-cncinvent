import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';
import { ProductType } from 'src/product-type/entities';
import { Product } from 'src/product/entities';

@InputType()
export class CreateProductInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  productType: ProductType;

  @Field(() => String)
  @IsNotEmpty({ message: 'El nombre del producto es requerido', always: true })
  @MinLength(2, {
    message: 'El nombre debe contener dos (2) o mas caracteres',
  })
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  serial?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  color?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  mark?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  model?: string;

  // 8b69caf7-c794-40fc-b124-37f1a62a527a
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  containedIn?: Product;
}
