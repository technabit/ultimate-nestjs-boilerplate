import { Queue } from '@/constants/job.constant';
import { CacheModule } from '@/shared/cache/cache.module';
import { JwtModule } from '@/shared/jwt/jwt.module';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: Queue.Email,
    }),
    BullBoardModule.forFeature({
      name: Queue.Email,
      adapter: BullMQAdapter,
    }),
    CacheModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
