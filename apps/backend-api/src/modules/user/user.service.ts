import { Injectable } from '@nestjs/common';
import { Organization, Prisma } from '@prisma/client';
import { PrismaService } from '@technabit/nest-core';

import {
  ORGANIZATION_ROLE_SEPARATOR,
  OrganizationRole,
  isOrganizationRole,
} from '@/modules/organization/constants/organization.constants';
import { OrganizationMemberModel } from '@/modules/organization/models/organization-member.model';
import { OrganizationModel } from '@/modules/organization/models/organization.model';
import { UserModel } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return user ? this.toUserModel(user) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    return user ? this.toUserModel(user) : null;
  }

  async getMemberships(userId: string): Promise<OrganizationMemberModel[]> {
    const members = await this.prisma.member.findMany({
      where: { userId },
      include: {
        organization: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return members.map((member) =>
      this.toOrganizationMemberModel(member, member.organization, member.user),
    );
  }

  toUserModel(user: unknown): UserModel {
    if (!user || typeof user !== 'object') {
      throw new Error('Invalid user payload.');
    }

    const record = user as Record<string, unknown>;
    const id = record.id;
    const email = record.email;

    if (!id || !email) {
      throw new Error('User payload is missing identifiers.');
    }

    return {
      id: String(id),
      email: String(email),
      name: this.readOptionalString(record.name),
      emailVerified: this.readBoolean(record.emailVerified),
      image: this.readOptionalString(record.image),
      username: this.readOptionalString(record.username),
      displayUsername: this.readOptionalString(record.displayUsername),
      phoneNumber: this.readOptionalString(record.phoneNumber),
      phoneNumberVerified: this.readOptionalBoolean(record.phoneNumberVerified),
      twoFactorEnabled: this.readOptionalBoolean(record.twoFactorEnabled),
      externalId: this.readOptionalString(record.externalId),
      role: this.readOptionalString(record.role),
      banned: this.readOptionalBoolean(record.banned),
      banReason: this.readOptionalString(record.banReason),
      createdAt: this.asDate(record.createdAt),
      updatedAt: this.asDate(record.updatedAt),
    };
  }

  toOrganizationModel(organization: Organization): OrganizationModel {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug ?? null,
      logo: organization.logo ?? null,
      createdAt: this.asDate(organization.createdAt),
      metadata: this.safeParseMetadata(organization.metadata),
    };
  }

  toOrganizationMemberModel(
    member: Prisma.MemberGetPayload<{
      include: { organization: true; user: true };
    }>,
    organization: Organization,
    user: unknown,
  ): OrganizationMemberModel {
    const rawRole = member.role ?? '';
    const parsedRoles = this.parseRoles(rawRole);

    return {
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      role: parsedRoles[0] ?? null,
      roles: parsedRoles,
      createdAt: this.asDate(member.createdAt),
      user: this.toUserModel(user),
      organization: this.toOrganizationModel(organization),
    };
  }

  private parseRoles(role: string | null | undefined): OrganizationRole[] {
    if (!role) {
      return [];
    }

    return role
      .split(ORGANIZATION_ROLE_SEPARATOR)
      .map((value) => value.trim().toLowerCase())
      .filter((value): value is OrganizationRole => isOrganizationRole(value));
  }

  private safeParseMetadata(metadata: unknown): Record<string, unknown> | null {
    if (metadata == null) {
      return null;
    }

    if (typeof metadata === 'object' && !Array.isArray(metadata)) {
      return metadata as Record<string, unknown>;
    }

    if (typeof metadata === 'string') {
      try {
        const parsed = JSON.parse(metadata);
        return typeof parsed === 'object' && parsed !== null
          ? (parsed as Record<string, unknown>)
          : null;
      } catch {
        return null;
      }
    }

    return null;
  }

  private asDate(value: unknown): Date {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    return new Date();
  }

  private readOptionalString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private readBoolean(value: unknown): boolean {
    return Boolean(value);
  }

  private readOptionalBoolean(value: unknown): boolean | null {
    if (value == null) {
      return null;
    }
    return Boolean(value);
  }
}
