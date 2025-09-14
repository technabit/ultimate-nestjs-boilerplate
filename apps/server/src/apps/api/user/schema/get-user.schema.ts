import { Uuid } from '@core/types/common';
import { UUIDField } from '@app/nest-core';
import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @UUIDField()
  id: Uuid;
}
