import { Environment } from '@core/constants/app';

export type AppConfig = {
  nodeEnv: `${Environment}`;
  isHttps: boolean;
  isWorker: boolean;
  name: string;
  appPrefix: string;
  url: string;
  port: number;
  workerPort: number;
  debug: boolean;
  fallbackLanguage: string;
  appLogging: boolean;
  logLevel: string;
  logService: string;
  corsOrigin: boolean | string[] | '*';
  localFileUpload: boolean;
};
