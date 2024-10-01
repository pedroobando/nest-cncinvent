import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities';

import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';

import { ProductTypeModule } from 'src/product-type/product-type.module';
import { ProductContainedModule } from 'src/product-contained/product-contained.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Product]), ProductTypeModule, ProductContainedModule],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
