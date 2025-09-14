import { AwsModule } from '@app/nest-core';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [FastifyMulterModule, AwsModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
