export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logging?: boolean;
  poolSize?: number;
  ssl?:
    | undefined
    | {
        rejectUnauthorized?: boolean;
        ca?: string;
        key?: string;
        cert?: string;
      };
};
