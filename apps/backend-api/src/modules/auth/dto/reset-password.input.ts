import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8).max(128),
  })
  .strict();

export type ResetPasswordInputType = z.infer<typeof ResetPasswordSchema>;

@InputType()
export class ResetPasswordInput {
  @Field()
  token!: string;

  @Field()
  newPassword!: string;
}
