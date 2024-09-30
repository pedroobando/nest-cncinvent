import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities';
import { ProductTypeModule } from 'src/product-type/product-type.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Product]), ProductTypeModule],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
