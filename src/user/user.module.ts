import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserResolver, UserService],
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
