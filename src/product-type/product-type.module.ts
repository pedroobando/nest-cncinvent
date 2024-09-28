import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ProductTypeResolver } from './product-type.resolver';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ProductType])],
  providers: [ProductTypeResolver, ProductTypeService],
})
export class ProductTypeModule {}
