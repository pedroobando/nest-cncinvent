import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { DepartamentService } from './departament.service';
import { Departament } from './entities/departament.entity';
import { CreateDepartamentInput, UpdateDepartamentInput } from './dto/inputs';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Resolver(() => Departament)
@UseGuards(JwtAuthGuard)
export class DepartamentResolver {
  constructor(private readonly departamentService: DepartamentService) {}

  @Mutation(() => Departament, { name: 'departamentCreate' })
  createDepartament(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
    @Args('createDepartamentInput')
    createDepartamentInput: CreateDepartamentInput,
  ) {
    return this.departamentService.create(createDepartamentInput, user);
  }

  @Query(() => [Departament], { name: 'departamentFindAll' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser() user: User,
  ) {
    return this.departamentService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Departament, { name: 'departamentFindOne' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.departamentService.findOne(id);
  }

  @Mutation(() => Departament, { name: 'departamentUpdate' })
  updateDepartament(
    @Args('updateDepartamentInput')
    updateDepartamentInput: UpdateDepartamentInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ) {
    return this.departamentService.update(
      updateDepartamentInput.id,
      updateDepartamentInput,
      user,
    );
  }

  @Mutation(() => Departament, { name: 'departamentRemove' })
  removeDepartament(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.departamentService.remove(id);
  }
}
