import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProductContainedService } from './product-contained.service';
import { ProductContained } from './entities/product-contained.entity';
import { CreateProductContainedInput, UpdateProductContainedInput } from './dto/inputs';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';
import { User } from 'src/user/entities';
import { PaginationArgs } from 'src/common/dto';

@Resolver(() => ProductContained)
@UseGuards(JwtAuthGuard)
export class ProductContainedResolver {
  constructor(private readonly productContainedService: ProductContainedService) {}

  @Mutation(() => ProductContained, { name: 'productContainedCreate' })
  createProductContained(
    @Args('createProductContainedInput') createProductContainedInput: CreateProductContainedInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) userCreate: User,
  ) {
    return this.productContainedService.create(createProductContainedInput, userCreate);
  }

  @Query(() => [ProductContained], { name: 'productContainedByProduct' })
  findAll(
    @Args('productId', { type: () => ID }, ParseUUIDPipe) productId: string,
    @Args() paginationArgs: PaginationArgs,
    @CurrentUser() user: User,
  ) {
    return this.productContainedService.findAllByProduct(productId, paginationArgs);
  }

  @Query(() => ProductContained, { name: 'productContainedfindOne' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.productContainedService.findOne(id);
  }

  @Mutation(() => ProductContained, { name: 'productContainedUpdate' })
  updateProductContained(
    @Args('updateProductContainedInput') updateProductContainedInput: UpdateProductContainedInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) userUpdate: User,
  ) {
    return this.productContainedService.update(
      updateProductContainedInput.id,
      updateProductContainedInput,
      userUpdate,
    );
  }

  @Mutation(() => ProductContained, { name: 'productContainedRemove' })
  removeProductContained(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.productContainedService.remove(id);
  }
}
