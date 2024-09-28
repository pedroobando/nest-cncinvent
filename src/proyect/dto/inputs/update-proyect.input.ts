import { IsBoolean, IsUUID } from 'class-validator';
import { CreateProyectInput } from './create-proyect.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProyectInput extends PartialType(CreateProyectInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => Boolean)
  @IsBoolean()
  isActive: boolean;
}
