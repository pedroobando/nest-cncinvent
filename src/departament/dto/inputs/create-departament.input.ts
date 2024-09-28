import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, Min, MinLength } from 'class-validator';

@InputType()
export class CreateDepartamentInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(2, {
    message:
      'El nombre del departamento debe contener dos (2) o mas caracteres',
  })
  name: string;

  // @Field(() => Boolean)
  // @IsBoolean()
  // isActive: boolean;

  // @Field(() => String)
  // @IsEmail(undefined, { message: 'Email no valido' })
  // email: string;

  // @Field(() => String)
  // @IsNotEmpty()
  // fullName: string;

  // @Field(() => String)
  // @MinLength(6)
  // password: string;
}
