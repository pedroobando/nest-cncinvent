import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateProductInput {
  // @Field(() => String)
  // @IsUUID()
  // @IsNotEmpty()
  // productType: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'El nombre del producto es requerido', always: true })
  @MinLength(2, {
    message: 'El nombre debe contener dos (2) o mas caracteres',
  })
  name: string;

  @Field(() => ID)
  @IsUUID()
  productTypeOne: string;

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
}
