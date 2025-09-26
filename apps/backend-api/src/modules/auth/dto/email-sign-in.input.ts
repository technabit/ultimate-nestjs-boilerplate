import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const EmailSignInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    rememberMe: z.boolean().optional(),
    callbackUrl: z.string().url().optional(),
  })
  .strict();

export type EmailSignInInputType = z.infer<typeof EmailSignInSchema>;

@InputType()
export class EmailSignInInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true, defaultValue: true })
  rememberMe?: boolean;

  @Field({ nullable: true })
  callbackUrl?: string;
}
