import { GlobalConfig } from '@/core/config/config.type';
import { ConfigService } from '@nestjs/config';
import { I18nOptionsWithoutResolvers } from 'nestjs-i18n';
declare function useI18nFactory(configService: ConfigService<GlobalConfig>): I18nOptionsWithoutResolvers;
export default useI18nFactory;
