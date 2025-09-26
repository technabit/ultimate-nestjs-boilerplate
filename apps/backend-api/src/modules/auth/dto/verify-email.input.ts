import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const VerifyEmailSchema = z
  .object({
    token: z.string().min(1),
    callbackUrl: z.string().url().optional(),
  })
  .strict();

export type VerifyEmailInputType = z.infer<typeof VerifyEmailSchema>;

@InputType()
export class VerifyEmailInput {
  @Field()
  token!: string;

  @Field({ nullable: true })
  callbackUrl?: string;
}
