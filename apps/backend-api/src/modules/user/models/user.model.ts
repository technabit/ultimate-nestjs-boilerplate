import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field()
  emailVerified!: boolean;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => String, { nullable: true })
  displayUsername?: string | null;

  @Field(() => String, { nullable: true })
  phoneNumber?: string | null;

  @Field(() => Boolean, { nullable: true })
  phoneNumberVerified?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  twoFactorEnabled?: boolean | null;

  @Field(() => String, { nullable: true })
  externalId?: string | null;

  @Field(() => String, { nullable: true })
  role?: string | null;

  @Field(() => Boolean, { nullable: true })
  banned?: boolean | null;

  @Field(() => String, { nullable: true })
  banReason?: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
