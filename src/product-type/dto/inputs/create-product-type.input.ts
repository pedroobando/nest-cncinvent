import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateProductTypeInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(2, {
    message: 'El nombre debe contener dos (2) o mas caracteres',
  })
  name: string;
}
