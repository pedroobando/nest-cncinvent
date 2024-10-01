import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from './entities';
import { CreateProductInput, UpdateProductInput } from './dto/inputs';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Resolver(() => Product)
@UseGuards(JwtAuthGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product, { name: 'productCreate' })
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) userCreate: User,
  ) {
    return this.productService.create(createProductInput, userCreate);
  }

  @Query(() => [Product], { name: 'productfindAll' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs, @CurrentUser() user: User) {
    return this.productService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Product, { name: 'productfindOne' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product, { name: 'productUpdate' })
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) userUpdate: User,
  ) {
    return this.productService.update(updateProductInput.id, updateProductInput, userUpdate);
  }

  @Mutation(() => Product, { name: 'productRemove' })
  removeProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.productService.remove(id);
  }

  // @ResolveField(() => Int, { name: 'productInCount' })
  // async productInCount(@Parent() product: Product, @CurrentUser() activeUser: User): Promise<number> {
  //   return this.productService.productInCount(product);
  // }

  // @ResolveField(() => Product, { name: 'fatherProduct', nullable: true })
  // async fatherProduct(@Parent() product: Product, @CurrentUser() activeUser: User): Promise<Product | null> {
  //   if (!product.containedIn) return null;
  //   return this.productService.fatherProduct(product);
  // }

  // @ResolveField(() => Product, { name: 'childrenProducts', nullable: true })
  // async chidrenProducts(
  //   @Parent() product: Product,
  //   @CurrentUser() activeUser: User,
  // ): Promise<Product[] | null> {
  //   // if (!product.containedIn) return null;
  //   let pepe = null;
  //   pepe = await this.productService.childrenProducts(product);
  //   console.log(typeof pepe);
  //   if (pepe !== null) return pepe;
  //   // console.log(pepe);
  //   return null;
  // }
}
