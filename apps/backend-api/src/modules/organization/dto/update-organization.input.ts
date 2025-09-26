import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const UpdateOrganizationSchema = z
  .object({
    organizationId: z.string().uuid(),
    name: z.string().min(3).max(120).optional(),
    slug: z
      .string()
      .min(3)
      .max(64)
      .regex(
        slugRegex,
        'Slug may only contain lowercase letters, numbers, and hyphens',
      )
      .optional(),
    logo: z.string().url().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .refine((value) => {
    return (
      value.name !== undefined ||
      value.slug !== undefined ||
      value.logo !== undefined ||
      value.metadata !== undefined
    );
  }, 'At least one field must be provided to update the organization.')
  .strict();

export type UpdateOrganizationInputType = z.infer<
  typeof UpdateOrganizationSchema
>;

@InputType()
export class UpdateOrganizationInput {
  @Field()
  organizationId!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  logo?: string | null;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown> | null;
}
