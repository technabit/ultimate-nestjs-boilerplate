import { TokenField } from '@/decorators/field.decorators';

export class VerifyEmailDto {
  @TokenField()
  token!: string;
}
