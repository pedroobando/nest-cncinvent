import { CreateDepartamentInput } from './create-departament.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsBoolean, IsUUID } from 'class-validator';

@InputType()
export class UpdateDepartamentInput extends PartialType(
  CreateDepartamentInput,
) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => Boolean)
  @IsBoolean()
  isActive: boolean;
}
