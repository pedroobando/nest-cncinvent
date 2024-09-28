import { Module } from '@nestjs/common';
import { ProyectService } from './proyect.service';
import { ProyectResolver } from './proyect.resolver';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyect } from './entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Proyect])],
  providers: [ProyectResolver, ProyectService],
})
export class ProyectModule {}
