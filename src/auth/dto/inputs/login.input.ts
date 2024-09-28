import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail(undefined, { message: 'Email no valido' })
  email: string;

  @Field(() => String)
  @MinLength(6)
  password: string;
}
