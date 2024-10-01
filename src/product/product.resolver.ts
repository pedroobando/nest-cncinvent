import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from './entities';
import { CreateProductInput, UpdateProductInput } from './dto/inputs';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';
import { User } from 'src/user/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { ProductContainedService } from 'src/product-contained/product-contained.service';
import { ProductContained } from 'src/product-contained/entities';

@Resolver(() => Product)
@UseGuards(JwtAuthGuard)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly productContainedService: ProductContainedService,
  ) {}

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

  @ResolveField(() => Int, { name: 'containedInCount' })
  containedInCount(@Parent() product: Product): Promise<number> {
    return this.productService.containedInCount(product);
  }

  @ResolveField(() => [ProductContained], { name: 'containedIn' })
  getContainedIn(
    @Parent() product: Product,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<ProductContained[]> {
    return this.productContainedService.findAllByProduct(product.id, paginationArgs);
  }

  // @ResolveField(() => [ListItem], { name: 'items' })
  // async getListItems(
  //   @Parent() list: List,
  //   @Args() paginationArgs: PaginationArgs,
  //   @Args() searchArgs: SearchArgs,
  // ): Promise<ListItem[]> {
  //   return this.listItemService.findAll(list, paginationArgs, searchArgs);
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
