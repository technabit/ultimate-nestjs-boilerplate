import { UUIDField } from '@app/nest-core';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteUserInput {
  @Field()
  @UUIDField()
  id: string;
}
