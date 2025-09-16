import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaHealthIndicator, SocketModule } from '@technabit/nest-core';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule, SocketModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
