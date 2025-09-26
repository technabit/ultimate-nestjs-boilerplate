import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { z } from 'zod';

import { ORGANIZATION_SLUG_REGEX } from '../constants/organization.constants';

export const CreateOrganizationSchema = z
  .object({
    name: z.string().min(3).max(120),
    slug: z
      .string()
      .min(3)
      .max(64)
      .regex(
        ORGANIZATION_SLUG_REGEX,
        'Slug may only contain lowercase letters, numbers, and hyphens',
      ),
    logo: z.string().url().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    keepCurrentActive: z.boolean().optional(),
  })
  .strict();

export type CreateOrganizationInputType = z.infer<
  typeof CreateOrganizationSchema
>;

@InputType()
export class CreateOrganizationInput {
  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  logo?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown> | null;

  @Field({ nullable: true })
  keepCurrentActive?: boolean;
}
