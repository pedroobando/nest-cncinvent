import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';

import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { CreateProyectInput, UpdateProyectInput } from './dto/inputs';

import { ProyectService } from './proyect.service';
import { Proyect } from './entities';
import { User } from 'src/user/entities';

@Resolver(() => Proyect)
@UseGuards(JwtAuthGuard)
export class ProyectResolver {
  constructor(private readonly proyectService: ProyectService) {}

  @Mutation(() => Proyect, { name: 'proyectCreate' })
  createProyect(
    @Args('createProyectInput') createProyectInput: CreateProyectInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) userCreate: User,
  ) {
    return this.proyectService.create(createProyectInput, userCreate);
  }

  @Query(() => [Proyect], { name: 'proyectfindAll' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs, @CurrentUser() user: User) {
    return this.proyectService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Proyect, { name: 'proyectfindOne' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.proyectService.findOne(id);
  }

  @Mutation(() => Proyect, { name: 'proyectUpdate' })
  updateProyect(
    @Args('updateProyectInput') updateProyectInput: UpdateProyectInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ) {
    return this.proyectService.update(updateProyectInput.id, updateProyectInput, user);
  }

  @Mutation(() => Proyect, { name: 'proyectRemove' })
  removeProyect(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.proyectService.remove(id);
  }
}
