import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const EmailSignUpSchema = z
  .object({
    name: z.string().min(1).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    image: z.string().url().optional(),
    callbackUrl: z.string().url().optional(),
    rememberMe: z.boolean().optional(),
  })
  .strict();

export type EmailSignUpInputType = z.infer<typeof EmailSignUpSchema>;

@InputType()
export class EmailSignUpInput {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  callbackUrl?: string;

  @Field({ nullable: true, defaultValue: true })
  rememberMe?: boolean;
}
