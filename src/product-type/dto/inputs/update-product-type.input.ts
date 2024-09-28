import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateProductTypeInput } from './create-product-type.input';

@InputType()
export class UpdateProductTypeInput extends PartialType(CreateProductTypeInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isActive?: boolean;
}
