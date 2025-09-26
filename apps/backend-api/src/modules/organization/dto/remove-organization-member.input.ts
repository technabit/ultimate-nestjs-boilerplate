import { Field, InputType } from '@nestjs/graphql';
import { z } from 'zod';

export const RemoveOrganizationMemberSchema = z
  .object({
    memberIdOrEmail: z.string().min(1),
    organizationId: z.string().uuid().optional(),
  })
  .strict();

export type RemoveOrganizationMemberInputType = z.infer<
  typeof RemoveOrganizationMemberSchema
>;

@InputType()
export class RemoveOrganizationMemberInput {
  @Field()
  memberIdOrEmail!: string;

  @Field({ nullable: true })
  organizationId?: string;
}
