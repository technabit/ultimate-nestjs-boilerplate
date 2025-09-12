import { UUIDField } from '@/core/decorators/field.decorators';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteUserInput {
  @Field()
  @UUIDField()
  id: string;
}
