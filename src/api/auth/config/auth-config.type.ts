export type AuthConfig = {
  cookieSecret: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  forgotSecret: string;
  forgotExpiresIn: string;
  confirmEmailSecret: string;
  confirmEmailExpiresIn: string;
};
