import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateProductContainedInput {
  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field(() => ID)
  @IsUUID()
  containedId: string;
}
