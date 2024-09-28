import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, MinLength } from 'class-validator';

@InputType()
export class ResetPassInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String)
  @MinLength(6)
  password: string;
}
