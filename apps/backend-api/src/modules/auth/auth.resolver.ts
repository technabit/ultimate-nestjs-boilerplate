import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AuthGuard, OptionalAuth, PublicAuth } from '@technabit/nest-core';

import { AuthService } from './auth.service';
import { EmailSignInInput } from './dto/email-sign-in.input';
import { EmailSignUpInput } from './dto/email-sign-up.input';
import { RequestPasswordResetInput } from './dto/request-password-reset.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { SendVerificationEmailInput } from './dto/send-verification-email.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import {
  AuthFlowResult,
  AuthSessionModel,
  VerifyEmailResult,
} from './models/auth.models';

interface GraphqlContext {
  req: FastifyRequest;
  res: FastifyReply;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthFlowResult)
  @PublicAuth()
  async signInWithEmail(
    @Args('input') input: EmailSignInInput,
    @Context() context: GraphqlContext,
  ): Promise<AuthFlowResult> {
    return this.authService.signInWithEmail(input, context.req, context.res);
  }

  @Mutation(() => AuthFlowResult)
  @PublicAuth()
  async signUpWithEmail(
    @Args('input') input: EmailSignUpInput,
    @Context() context: GraphqlContext,
  ): Promise<AuthFlowResult> {
    return this.authService.signUpWithEmail(input, context.req, context.res);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async signOut(@Context() context: GraphqlContext): Promise<boolean> {
    return this.authService.signOut(context.req, context.res);
  }

  @Mutation(() => Boolean)
  @PublicAuth()
  async requestPasswordReset(
    @Args('input') input: RequestPasswordResetInput,
  ): Promise<boolean> {
    return this.authService.requestPasswordReset(input);
  }

  @Mutation(() => Boolean)
  @PublicAuth()
  async resetPassword(
    @Args('input') input: ResetPasswordInput,
  ): Promise<boolean> {
    return this.authService.resetPassword(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async sendVerificationEmail(
    @Args('input') input: SendVerificationEmailInput,
    @Context() context: GraphqlContext,
  ): Promise<boolean> {
    return this.authService.sendVerificationEmail(input, context.req);
  }

  @Mutation(() => VerifyEmailResult)
  @PublicAuth()
  async verifyEmail(
    @Args('input') input: VerifyEmailInput,
    @Context() context: GraphqlContext,
  ): Promise<VerifyEmailResult> {
    return this.authService.verifyEmail(input, context.req);
  }

  @Query(() => AuthSessionModel, { name: 'authSession', nullable: true })
  @UseGuards(AuthGuard)
  @OptionalAuth()
  async authSession(
    @Context() context: GraphqlContext,
  ): Promise<AuthSessionModel | null> {
    return this.authService.getSession(context.req);
  }
}
