import { StringFieldOptional } from '@technabit/nest-core';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateUserProfileDto {
  @StringFieldOptional()
  @Expose()
  username: string;

  @StringFieldOptional({ nullable: true })
  @Expose()
  firstName: string;

  @StringFieldOptional({ nullable: true })
  @Expose()
  lastName: string;

  @StringFieldOptional({ nullable: true })
  @Expose()
  image: string;
}
