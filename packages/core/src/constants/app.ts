export enum Environment {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export enum LogService {
  Console = 'console',
  GoogleLogging = 'google-logging',
  AwsCloudWatch = 'aws-cloudwatch',
}

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC',
}

export const loggingRedactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["set-cookie"]',
  'res.headers["set-cookie"]',
  'password',
  'token',
];

export const IS_PUBLIC = 'is-public';
export const IS_AUTH_OPTIONAL = 'is-auth-optional';

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_CURRENT_PAGE = 1;
export const SYSTEM_USER_ID = 'system';

