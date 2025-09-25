import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Uuid, UUIDField } from '@technabit/nest-core';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @UUIDField()
  id: Uuid;
}
