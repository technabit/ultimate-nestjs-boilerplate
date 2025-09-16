import mailConfig from '@/core/config/mail/mail.config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigType } from '@nestjs/config';
import path from 'path';

async function useMailFactory(
  config: ConfigType<typeof mailConfig>,
): Promise<MailerOptions> {
  return {
    transport: {
      host: config.host,
      port: config.port,
      ignoreTLS: config.ignoreTLS,
      requireTLS: config.requireTLS,
      secure: config.secure,
      logger: false, // This will be logged via app logger instead.
      auth: {
        user: config.user,
        pass: config.password,
      },
    },
    defaults: {
      from: `"${config.defaultName}" <${config.defaultEmail}>`,
    },
    template: {
      dir: path.join(__dirname, '..', '..', 'shared/mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}

export default useMailFactory;
