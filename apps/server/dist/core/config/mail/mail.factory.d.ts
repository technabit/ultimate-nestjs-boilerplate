import { GlobalConfig } from '@/core/config/config.type';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
declare function useMailFactory(config: ConfigService<GlobalConfig>): Promise<MailerOptions>;
export default useMailFactory;
