import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

import { OrganizationRole } from '../constants/organization.constants';

export const AddOrganizationMemberSchema = z
  .object({
    organizationId: z.string().uuid().optional(),
    userId: z.string().uuid(),
    roles: z
      .array(z.nativeEnum(OrganizationRole))
      .nonempty()
      .default([OrganizationRole.Member]),
    teamId: z.string().uuid().optional(),
  })
  .strict();

export type AddOrganizationMemberInputType = z.infer<
  typeof AddOrganizationMemberSchema
>;

@InputType()
export class AddOrganizationMemberInput {
  @Field()
  userId!: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field(() => [OrganizationRole], { defaultValue: [OrganizationRole.Member] })
  roles?: OrganizationRole[];

  @Field({ nullable: true })
  teamId?: string;
}
