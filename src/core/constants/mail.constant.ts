/**
 * These template names must match the email template files at ~/src/core/shared/mail/templates
 */
export const MailTemplate = {
  EmailVerification: 'email-verification',
  SignInMagicLink: 'signin-magic-link',
  ResetPassword: 'reset-password',
} as const;
