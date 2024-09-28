import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail(undefined, { message: 'Email no valido' })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @IsNotEmpty()
  color: string;

  @Field(() => String)
  @MinLength(6)
  password: string;
}
