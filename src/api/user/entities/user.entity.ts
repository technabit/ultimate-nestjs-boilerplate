import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index } from 'typeorm';
import { Role } from '../user.enum';

@Entity('user')
export class UserEntity extends BaseModel {
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Index({ unique: true, where: '"deletedAt" IS NULL' })
  @Column()
  username: string;

  @Index({ unique: true, where: '"deletedAt" IS NULL' })
  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;
}
