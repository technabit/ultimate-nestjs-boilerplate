import { Field, InputType } from '@nestjs/graphql';
import { UUIDField } from '@technabit/nest-core';

@InputType()
export class DeleteUserInput {
  @Field()
  @UUIDField()
  id: string;
}
