import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
