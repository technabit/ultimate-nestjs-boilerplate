import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, FileModule],
})
export class DemoModule {}
