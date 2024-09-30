import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { ProductTypeService } from './product-type.service';
import { ProductType } from './entities';

import { CreateProductTypeInput, UpdateProductTypeInput } from './dto/inputs';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Resolver(() => ProductType)
@UseGuards(JwtAuthGuard)
export class ProductTypeResolver {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Mutation(() => ProductType, { name: 'productTypeCreate' })
  createProductType(
    @Args('createProductTypeInput') createProductTypeInput: CreateProductTypeInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) userCreate: User,
  ) {
    return this.productTypeService.create(createProductTypeInput, userCreate);
  }

  @Query(() => [ProductType], { name: 'productTypefindAll' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs, @CurrentUser() user: User) {
    return this.productTypeService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => ProductType, { name: 'productTypefindOne' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.productTypeService.findOne(id);
  }

  @Mutation(() => ProductType, { name: 'productTypeUpdate' })
  updateProductType(
    @Args('updateProductTypeInput') updateProductTypeInput: UpdateProductTypeInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ) {
    return this.productTypeService.update(updateProductTypeInput.id, updateProductTypeInput, user);
  }

  @Mutation(() => ProductType, { name: 'productTypeRemove' })
  removeProductType(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.productTypeService.remove(id);
  }
}
