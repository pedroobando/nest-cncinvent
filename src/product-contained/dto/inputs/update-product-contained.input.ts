import { CreateProductContainedInput } from './create-product-contained.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductContainedInput extends PartialType(CreateProductContainedInput) {
  @Field(() => Int)
  id: number;
}
