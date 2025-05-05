export type AuthConfig = {
  authSecret: string;
  oAuth: {
    github: {
      clientId?: string;
      clientSecret?: string;
    };
  };
};
