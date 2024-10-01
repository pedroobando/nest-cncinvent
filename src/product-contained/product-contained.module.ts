import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductContainedService } from './product-contained.service';
import { ProductContainedResolver } from './product-contained.resolver';
import { ProductContained } from './entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ProductContained])],
  providers: [ProductContainedResolver, ProductContainedService],
  exports: [TypeOrmModule, ProductContainedService],
})
export class ProductContainedModule {}
