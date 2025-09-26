import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

import { OrganizationRole } from '../constants/organization.constants';

export const UpdateOrganizationMemberRoleSchema = z
  .object({
    memberId: z.string().uuid(),
    organizationId: z.string().uuid().optional(),
    roles: z.array(z.nativeEnum(OrganizationRole)).nonempty(),
  })
  .strict();

export type UpdateOrganizationMemberRoleInputType = z.infer<
  typeof UpdateOrganizationMemberRoleSchema
>;

@InputType()
export class UpdateOrganizationMemberRoleInput {
  @Field()
  memberId!: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field(() => [OrganizationRole])
  roles!: OrganizationRole[];
}
