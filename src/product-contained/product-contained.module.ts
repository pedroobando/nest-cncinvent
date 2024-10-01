import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductContainedService } from './product-contained.service';
import { ProductContainedResolver } from './product-contained.resolver';
import { ProductContained } from './entities';
import { ProductModule } from 'src/product';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ProductContained]), ProductModule],
  providers: [ProductContainedResolver, ProductContainedService],
})
export class ProductContainedModule {}
