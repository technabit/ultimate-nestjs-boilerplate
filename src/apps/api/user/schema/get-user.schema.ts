import { Uuid } from '@/core/common/types/common.type';
import { UUIDField } from '@/core/decorators/field.decorators';
import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @UUIDField()
  id: Uuid;
}
