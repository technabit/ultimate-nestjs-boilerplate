import { Injectable } from '@nestjs/common';
import { APIError } from 'better-auth/api';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GraphQLError } from 'graphql';

import { BetterAuthService, UserSession } from '@technabit/nest-core';

import {
  buildBetterAuthHeaders,
  forwardSetCookies,
  mergeRequestHeadersWithSetCookies,
} from '@/modules/shared/utils/auth-response.util';
import { UserService } from '@/modules/user/user.service';
import {
  EmailSignInInputType,
  EmailSignInSchema,
} from './dto/email-sign-in.input';
import {
  EmailSignUpInputType,
  EmailSignUpSchema,
} from './dto/email-sign-up.input';
import {
  RequestPasswordResetInputType,
  RequestPasswordResetSchema,
} from './dto/request-password-reset.input';
import {
  ResetPasswordInputType,
  ResetPasswordSchema,
} from './dto/reset-password.input';
import {
  SendVerificationEmailInputType,
  SendVerificationEmailSchema,
} from './dto/send-verification-email.input';
import {
  VerifyEmailInputType,
  VerifyEmailSchema,
} from './dto/verify-email.input';
import {
  AuthFlowResult,
  AuthSessionModel,
  SessionModel,
  VerifyEmailResult,
} from './models/auth.models';

@Injectable()
export class AuthService {
  constructor(
    private readonly betterAuth: BetterAuthService,
    private readonly userService: UserService,
  ) {}

  async signInWithEmail(
    input: EmailSignInInputType,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<AuthFlowResult> {
    const parsed = EmailSignInSchema.parse(input);

    try {
      const { headers, response } = await this.betterAuth.api.signInEmail({
        body: {
          email: parsed.email,
          password: parsed.password,
          callbackURL: parsed.callbackUrl,
          rememberMe: parsed.rememberMe ?? true,
        },
        headers: buildBetterAuthHeaders(request),
        returnHeaders: true,
      });

      forwardSetCookies(headers, reply);

      const sessionHeaders = mergeRequestHeadersWithSetCookies(
        request,
        headers,
      );
      const session = await this.safeGetSession(sessionHeaders);

      const normalized = this.extractAuthFlowResponse(response);
      const userPayload =
        normalized.user ?? session?.user ?? this.buildFallbackUser(parsed.email);

      return {
        redirect: normalized.redirect,
        url: normalized.url,
        token: normalized.token,
        user: this.userService.toUserModel(userPayload),
        session: session ? this.mapSession(session) : null,
      };
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to sign in.');
    }
  }

  async signUpWithEmail(
    input: EmailSignUpInputType,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<AuthFlowResult> {
    const parsed = EmailSignUpSchema.parse(input);

    try {
      const { headers, response } = await this.betterAuth.api.signUpEmail({
        body: {
          name: parsed.name,
          email: parsed.email,
          password: parsed.password,
          image: parsed.image,
          callbackURL: parsed.callbackUrl,
          rememberMe: parsed.rememberMe ?? true,
        },
        headers: buildBetterAuthHeaders(request),
        returnHeaders: true,
      });

      forwardSetCookies(headers, reply);
      const sessionHeaders = mergeRequestHeadersWithSetCookies(
        request,
        headers,
      );
      const session = await this.safeGetSession(sessionHeaders);

      const normalized = this.extractAuthFlowResponse(response);
      const userPayload =
        normalized.user ?? session?.user ?? this.buildFallbackUser(parsed.email);

      return {
        redirect: normalized.redirect,
        url: normalized.url,
        token: normalized.token,
        user: this.userService.toUserModel(userPayload),
        session: session ? this.mapSession(session) : null,
      };
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to sign up.');
    }
  }

  async signOut(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<boolean> {
    try {
      const { headers, response } = await this.betterAuth.api.signOut({
        headers: buildBetterAuthHeaders(request),
        returnHeaders: true,
      });
      forwardSetCookies(headers, reply);
      const success =
        typeof response === 'object' &&
        response !== null &&
        'success' in response
          ? Boolean((response as Record<string, unknown>).success)
          : true;
      return success;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to sign out.');
    }
  }

  async sendVerificationEmail(
    input: SendVerificationEmailInputType,
    request: FastifyRequest,
  ): Promise<boolean> {
    const parsed = SendVerificationEmailSchema.parse(input);
    try {
      const response = await this.betterAuth.api.sendVerificationEmail({
        body: {
          email: parsed.email,
          callbackURL: parsed.callbackUrl,
        },
        headers: buildBetterAuthHeaders(request),
      });
      const status =
        typeof response === 'object' &&
        response !== null &&
        'status' in response
          ? Boolean((response as Record<string, unknown>).status)
          : true;
      return status;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to send verification email.');
    }
  }

  async verifyEmail(
    input: VerifyEmailInputType,
    request: FastifyRequest,
  ): Promise<VerifyEmailResult> {
    const parsed = VerifyEmailSchema.parse(input);

    try {
      const response = await this.betterAuth.api.verifyEmail({
        query: {
          token: parsed.token,
          callbackURL: parsed.callbackUrl,
        },
        headers: buildBetterAuthHeaders(request),
      });

      const status =
        typeof response === 'object' &&
        response !== null &&
        'status' in response
          ? Boolean((response as Record<string, unknown>).status)
          : false;

      const userPayload =
        typeof response === 'object' && response !== null && 'user' in response
          ? (response as Record<string, unknown>).user
          : null;

      return {
        status,
        user: userPayload ? this.userService.toUserModel(userPayload) : null,
      };
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to verify email.');
    }
  }

  async requestPasswordReset(
    input: RequestPasswordResetInputType,
  ): Promise<boolean> {
    const parsed = RequestPasswordResetSchema.parse(input);
    try {
      const response = await this.betterAuth.api.requestPasswordReset({
        body: {
          email: parsed.email,
          redirectTo: parsed.redirectTo,
        },
      });
      const status =
        typeof response === 'object' &&
        response !== null &&
        'status' in response
          ? Boolean((response as Record<string, unknown>).status)
          : true;
      return status;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to request password reset.');
    }
  }

  async resetPassword(input: ResetPasswordInputType): Promise<boolean> {
    const parsed = ResetPasswordSchema.parse(input);
    try {
      const response = await this.betterAuth.api.resetPassword({
        body: {
          newPassword: parsed.newPassword,
          token: parsed.token,
        },
      });
      const status =
        typeof response === 'object' &&
        response !== null &&
        'status' in response
          ? Boolean((response as Record<string, unknown>).status)
          : true;
      return status;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to reset password.');
    }
  }

  async getSession(request: FastifyRequest): Promise<AuthSessionModel | null> {
    try {
      const session = await this.betterAuth.api.getSession({
        headers: buildBetterAuthHeaders(request),
      });
      return session ? this.mapSession(session) : null;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to retrieve session.');
    }
  }

  private mapSession(session: UserSession): AuthSessionModel {
    const rawSession = session.session as Record<string, unknown>;

    const normalizedSession: SessionModel = {
      id: String(rawSession.id),
      token: String(rawSession.token ?? ''),
      userId: String(rawSession.userId ?? ''),
      createdAt: this.asDate(rawSession.createdAt ?? new Date()),
      updatedAt: this.asDate(rawSession.updatedAt ?? new Date()),
      expiresAt: this.asDate(rawSession.expiresAt ?? new Date()),
      ipAddress: this.readOptionalString(rawSession.ipAddress),
      userAgent: this.readOptionalString(rawSession.userAgent),
      activeOrganizationId: this.readOptionalString(
        rawSession.activeOrganizationId,
      ),
      impersonatedBy: this.readOptionalString(rawSession.impersonatedBy),
    };

    return {
      session: normalizedSession,
      user: this.userService.toUserModel(session.user),
    };
  }

  private async safeGetSession(
    headers: globalThis.Headers,
  ): Promise<UserSession | null> {
    try {
      return await this.betterAuth.api.getSession({ headers });
    } catch {
      return null;
    }
  }

  private asDate(value: unknown): Date {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    return new Date();
  }

  private readOptionalString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private extractAuthFlowResponse(response: unknown): {
    redirect: boolean;
    url: string | null;
    token: string | null;
    user: unknown;
  } {
    if (!response || typeof response !== 'object') {
      return { redirect: false, url: null, token: null, user: null };
    }

    const record = response as Record<string, unknown>;
    const redirect = typeof record.redirect === 'boolean' ? record.redirect : false;
    const url = typeof record.url === 'string' ? record.url : null;
    const token = typeof record.token === 'string' ? record.token : null;
    const user = record.user ?? null;

    return { redirect, url, token, user };
  }

  private buildFallbackUser(email: string) {
    return {
      id: email,
      email,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private toGraphQLError(
    error: unknown,
    fallbackMessage: string,
  ): GraphQLError {
    if (error instanceof GraphQLError) {
      return error;
    }

    if (error instanceof APIError) {
      const payload = error as APIError & {
        status?: unknown;
        body?: unknown;
      };
      const status = payload.status ?? 'BETTER_AUTH_ERROR';
      return new GraphQLError(error.message ?? fallbackMessage, {
        extensions: {
          code: status,
          status,
          details: payload.body ?? undefined,
        },
      });
    }

    if (error instanceof Error) {
      return new GraphQLError(error.message || fallbackMessage);
    }

    return new GraphQLError(fallbackMessage);
  }
}
