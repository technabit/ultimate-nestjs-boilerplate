import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class Worker2Module {}

async function bootstrap() {
  const app = await NestFactory.create(Worker2Module, { bufferLogs: true });
  // eslint-disable-next-line no-console
  console.info('\x1b[36mWorker2 app started');
  await app.close();
}

void bootstrap();

