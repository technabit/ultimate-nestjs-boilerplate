import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

import { UserModel } from '@/modules/user/models/user.model';
import { OrganizationRole } from '../constants/organization.constants';
import { OrganizationModel } from './organization.model';

@ObjectType('OrganizationMember')
export class OrganizationMemberModel {
  @Field(() => ID)
  id!: string;

  @Field()
  organizationId!: string;

  @Field()
  userId!: string;

  @Field(() => OrganizationRole, { nullable: true })
  role?: OrganizationRole | null;

  @Field(() => [OrganizationRole])
  roles!: OrganizationRole[];

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => UserModel)
  user!: UserModel;

  @Field(() => OrganizationModel, { nullable: true })
  organization?: OrganizationModel | null;
}
