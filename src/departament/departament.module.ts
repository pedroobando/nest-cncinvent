import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartamentService } from './departament.service';
import { DepartamentResolver } from './departament.resolver';

import { Departament } from './entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Departament])],
  providers: [DepartamentResolver, DepartamentService],
})
export class DepartamentModule {}
