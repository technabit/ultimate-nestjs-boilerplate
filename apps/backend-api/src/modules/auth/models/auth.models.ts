import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

import { UserModel } from '@/modules/user/models/user.model';

@ObjectType()
export class SessionModel {
  @Field(() => ID)
  id!: string;

  @Field()
  token!: string;

  @Field()
  userId!: string;

  @Field(() => GraphQLISODateTime)
  expiresAt!: Date;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  ipAddress?: string | null;

  @Field(() => String, { nullable: true })
  userAgent?: string | null;

  @Field(() => String, { nullable: true })
  activeOrganizationId?: string | null;

  @Field(() => String, { nullable: true })
  impersonatedBy?: string | null;
}

@ObjectType()
export class AuthSessionModel {
  @Field(() => SessionModel)
  session!: SessionModel;

  @Field(() => UserModel)
  user!: UserModel;
}

@ObjectType()
export class AuthFlowResult {
  @Field(() => Boolean)
  redirect!: boolean;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  token?: string | null;

  @Field(() => UserModel)
  user!: UserModel;

  @Field(() => AuthSessionModel, { nullable: true })
  session?: AuthSessionModel | null;
}

@ObjectType()
export class VerifyEmailResult {
  @Field()
  status!: boolean;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel | null;
}
