export enum CacheKey {
  AccessToken = 'auth:token:%s:access', // %s: hash
  EmailVerificationToken = 'auth:token:%s:email-verification', // %s: userId
  UserSocketClients = 'socket:%s:clients', // %s: userId
}
