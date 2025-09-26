import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const SendVerificationEmailSchema = z
  .object({
    email: z.string().email(),
    callbackUrl: z.string().url().optional(),
  })
  .strict();

export type SendVerificationEmailInputType = z.infer<
  typeof SendVerificationEmailSchema
>;

@InputType()
export class SendVerificationEmailInput {
  @Field()
  email!: string;

  @Field({ nullable: true })
  callbackUrl?: string;
}
