import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mailConfig from '@/core/config/mail/mail.config';

import useMailFactory from '../../config/mail/mail.factory';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [mailConfig.KEY],
      useFactory: useMailFactory,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
