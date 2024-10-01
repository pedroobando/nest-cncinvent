import { IsUUID } from 'class-validator';
import { CreateProductContainedInput } from './create-product-contained.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProductContainedInput extends PartialType(CreateProductContainedInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
