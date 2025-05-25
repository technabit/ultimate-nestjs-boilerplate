import { GlobalConfig } from '@/config/config.type';
import { Queue } from '@/constants/job.constant';
import { EmailQueue } from '@/worker/queues/email/email.type';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * NOTE: This service is for handling auth related tasks outside of Better Auth.
 * You cannot import better auth instance from `better-auth.service.ts` here since we already use this service to create Better Auth instance and will cause a circular loop.
 */
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<GlobalConfig>,
    @InjectQueue(Queue.Email)
    private readonly emailQueue: EmailQueue,
  ) {}

  async sendMagicLink({ email, url }: { email: string; url: string }) {
    // You can rate-limit user attempts here if you want

    await this.emailQueue.add('signin-magic-link', {
      email,
      url,
    });
  }

  async verifyEmail({ url, userId }: { url: string; userId: string }) {
    // You can rate-limit user attempts here if you want

    await this.emailQueue.add('email-verification', {
      url,
      userId,
    });
  }

  async resetPassword({ url, userId }: { url: string; userId: string }) {
    // You can rate-limit user attempts here if you want

    await this.emailQueue.add('reset-password', {
      url,
      userId,
    });
  }

  /**
   * Creates a basic auth username:password header that you can pass for API that is protected behind `basicAuthMiddleware`
   */
  createBasicAuthHeaders() {
    const username = this.configService.getOrThrow('auth.basicAuth.username', {
      infer: true,
    });
    const password = this.configService.getOrThrow('auth.basicAuth.password', {
      infer: true,
    });
    const base64Credential = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );
    return {
      Authorization: `Basic ${base64Credential}`,
    };
  }
}
