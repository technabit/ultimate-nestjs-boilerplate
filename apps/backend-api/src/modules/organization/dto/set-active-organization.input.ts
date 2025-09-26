import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const SetActiveOrganizationSchema = z
  .object({
    organizationId: z.string().uuid().nullable().optional(),
    organizationSlug: z.string().min(1).optional(),
  })
  .refine(
    (value) => value.organizationId != null || value.organizationSlug != null,
    'Provide either an organization id or slug.',
  )
  .strict();

export type SetActiveOrganizationInputType = z.infer<
  typeof SetActiveOrganizationSchema
>;

@InputType()
export class SetActiveOrganizationInput {
  @Field({ nullable: true })
  organizationId?: string | null;

  @Field({ nullable: true })
  organizationSlug?: string;
}
