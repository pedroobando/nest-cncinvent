import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserService } from './user.service';
// import { ListsService } from 'src/lists';
// import { ItemsService } from 'src/items/items.service';

import { User } from './entities/user.entity';
// import { Item } from 'src/items/entities';
// import { List } from 'src/lists/entities';

import { PaginationArgs, SearchArgs } from 'src/common/dto';

import { ValidRolesArgs } from './dto/args/roles.arg';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums';
import { ResetPassInput, UpdateUserInput } from './dto/inputs';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'userFindall' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<User[]> {
    console.log({ searchArgs });
    return this.userService.findAll(
      validRoles.roles,
      paginationArgs,
      searchArgs,
    );
  }

  @Query(() => User, { name: 'userFindOne' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => User, { name: 'userUpdate' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    console.log({ updateUserInput });
    return this.userService.update(updateUserInput, user);
  }

  @Mutation(() => User, { name: 'userBlock' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.userService.block(id, user);
  }

  @Mutation(() => User, { name: 'userResetPass' })
  resetPassWord(
    @Args('resetpassInput') resetPassInput: ResetPassInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
  ): Promise<User> {
    return this.userService.resetPassWord(resetPassInput, adminUser);
  }

  // @ResolveField(() => Int, { name: 'itemCount' })
  // async itemCount(
  //   @Parent() user: User,
  //   @CurrentUser([ValidRoles.admin]) activeUser: User,
  // ): Promise<number> {
  //   return this.itemsService.itemCountByUser(user);
  // }

  // @ResolveField(() => Int, { name: 'listCount' })
  // async listCount(
  //   @Parent() user: User,
  //   @CurrentUser([ValidRoles.admin]) activeUser: User,
  // ): Promise<number> {
  //   return this.listsService.listCountByUser(user);
  // }

  // @ResolveField(() => [Item], { name: 'item' })
  // async getItemByUser(
  //   @Parent() user: User,
  //   @CurrentUser([ValidRoles.admin]) activeUser: User,
  //   @Args() paginationArgs: PaginationArgs,
  //   @Args() searchArgs: SearchArgs,
  // ): Promise<Item[]> {
  //   return this.itemsService.findAll(user, paginationArgs, searchArgs);
  // }

  // @ResolveField(() => [List], { name: 'list' })
  // async getListByUser(
  //   @Parent() user: User,
  //   @CurrentUser([ValidRoles.user]) activeUser: User,
  //   @Args() paginationArgs: PaginationArgs,
  //   @Args() searchArgs: SearchArgs,
  // ): Promise<List[]> {
  //   return this.listsService.findAll(user, paginationArgs, searchArgs);
  // }
}
