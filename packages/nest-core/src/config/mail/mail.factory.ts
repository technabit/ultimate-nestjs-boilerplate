import mailConfig from '@/core/config/mail/mail.config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigType } from '@nestjs/config';
import fs from 'fs';
import path from 'path';

async function useMailFactory(
  config: ConfigType<typeof mailConfig>,
): Promise<MailerOptions> {
  // Resolve templates directory robustly across bundled/non-bundled builds
  const packageRootDir = path.dirname(
    require.resolve('@technabit/nest-core/package.json'),
  );

  const candidateTemplateDirs = [
    // Preferred: package root dist folder
    path.join(packageRootDir, 'dist', 'shared', 'mail', 'templates'),
    // If not bundled, relative from compiled file two directories up
    path.join(__dirname, '..', '..', 'shared', 'mail', 'templates'),
    // If bundled to dist root, relative from current dir
    path.join(__dirname, 'shared', 'mail', 'templates'),
  ];

  const resolvedTemplatesDir =
    candidateTemplateDirs.find((dir) => {
      try {
        return fs.existsSync(dir);
      } catch {
        return false;
      }
    }) || candidateTemplateDirs[0];

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
      dir: resolvedTemplatesDir,
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}

export default useMailFactory;
