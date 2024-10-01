import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductContainedService } from './product-contained.service';
import { ProductContained } from './entities/product-contained.entity';
import { CreateProductContainedInput, UpdateProductContainedInput } from './dto/inputs';

@Resolver(() => ProductContained)
export class ProductContainedResolver {
  constructor(private readonly productContainedService: ProductContainedService) {}

  @Mutation(() => ProductContained)
  createProductContained(
    @Args('createProductContainedInput') createProductContainedInput: CreateProductContainedInput,
  ) {
    return this.productContainedService.create(createProductContainedInput);
  }

  @Query(() => [ProductContained], { name: 'productContained' })
  findAll() {
    return this.productContainedService.findAll();
  }

  @Query(() => ProductContained, { name: 'productContained' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productContainedService.findOne(id);
  }

  @Mutation(() => ProductContained)
  updateProductContained(
    @Args('updateProductContainedInput') updateProductContainedInput: UpdateProductContainedInput,
  ) {
    return this.productContainedService.update(updateProductContainedInput.id, updateProductContainedInput);
  }

  @Mutation(() => ProductContained)
  removeProductContained(@Args('id', { type: () => Int }) id: number) {
    return this.productContainedService.remove(id);
  }
}
