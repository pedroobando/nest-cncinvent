import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, Min, MinLength } from 'class-validator';

@InputType()
export class CreateProyectInput {
  @Field(() => Int)
  @Min(1, { message: 'El codigo debe ser mayor a cero (0)' })
  code: number;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(2, {
    message: 'El nombre del proyecto debe contener dos (2) o mas caracteres',
  })
  name: string;
}
