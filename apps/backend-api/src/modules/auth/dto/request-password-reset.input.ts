import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const RequestPasswordResetSchema = z
  .object({
    email: z.string().email(),
    redirectTo: z.string().url().optional(),
  })
  .strict();

export type RequestPasswordResetInputType = z.infer<
  typeof RequestPasswordResetSchema
>;

@InputType()
export class RequestPasswordResetInput {
  @Field()
  email!: string;

  @Field({ nullable: true })
  redirectTo?: string;
}
