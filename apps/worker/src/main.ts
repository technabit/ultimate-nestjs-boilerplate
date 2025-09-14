import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Module({})
class Worker2Module {}

async function bootstrap() {
  const app = await NestFactory.create(Worker2Module, { bufferLogs: true });
  // eslint-disable-next-line no-console
  console.info('\x1b[36mBackend Worker app started');
  await app.close();
}

void bootstrap();
