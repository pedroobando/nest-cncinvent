import { Module } from '@nestjs/common';
import { ProductContainedService } from './product-contained.service';
import { ProductContainedResolver } from './product-contained.resolver';

@Module({
  providers: [ProductContainedResolver, ProductContainedService],
})
export class ProductContainedModule {}
