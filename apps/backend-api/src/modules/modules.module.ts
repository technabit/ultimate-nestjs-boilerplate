import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, OrganizationModule, UserModule],
})
export class ModulesModule {}
