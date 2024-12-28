import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  imports: [NestJwtModule.register({})],
  providers: [ConfigService, JwtService],
  exports: [JwtService],
})
export class JwtModule {}
