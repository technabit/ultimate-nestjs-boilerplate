import { Uuid } from '@technabit/nest-core';
import { UUIDField } from '@technabit/nest-core';
import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @UUIDField()
  id: Uuid;
}
