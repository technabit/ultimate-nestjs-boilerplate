import { Injectable } from '@nestjs/common';
import { APIError } from 'better-auth/api';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GraphQLError } from 'graphql';

import { BetterAuthService, PrismaService } from '@technabit/nest-core';

import {
  buildBetterAuthHeaders,
  forwardSetCookies,
  mergeRequestHeadersWithSetCookies,
} from '@/modules/shared/utils/auth-response.util';
import { UserService } from '@/modules/user/user.service';
import {
  ORGANIZATION_ADMIN_ROLES,
  ORGANIZATION_ROLE_SEPARATOR,
  OrganizationRole,
  isOrganizationRole,
} from './constants/organization.constants';
import {
  AddOrganizationMemberInputType,
  AddOrganizationMemberSchema,
} from './dto/add-organization-member.input';
import {
  CreateOrganizationInputType,
  CreateOrganizationSchema,
} from './dto/create-organization.input';
import {
  RemoveOrganizationMemberInputType,
  RemoveOrganizationMemberSchema,
} from './dto/remove-organization-member.input';
import {
  SetActiveOrganizationInputType,
  SetActiveOrganizationSchema,
} from './dto/set-active-organization.input';
import {
  UpdateOrganizationMemberRoleInputType,
  UpdateOrganizationMemberRoleSchema,
} from './dto/update-organization-member-role.input';
import {
  UpdateOrganizationInputType,
  UpdateOrganizationSchema,
} from './dto/update-organization.input';
import { OrganizationMemberModel } from './models/organization-member.model';
import { OrganizationModel } from './models/organization.model';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly betterAuth: BetterAuthService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async listOrganizations(
    request: FastifyRequest,
  ): Promise<OrganizationModel[]> {
    try {
      const organizations = await this.betterAuth.api.listOrganizations({
        headers: buildBetterAuthHeaders(request),
      });
      return organizations.map((organization) =>
        this.mapOrganization(organization),
      );
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to list organizations.');
    }
  }

  async getOrganization(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationModel | null> {
    const membership = await this.ensureMembership(userId, organizationId);
    if (!membership) {
      return null;
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    return organization ? this.mapOrganization(organization) : null;
  }

  async createOrganization(
    input: CreateOrganizationInputType,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<OrganizationModel> {
    const parsed = CreateOrganizationSchema.parse(input);

    try {
      const { headers, response } = await this.betterAuth.api.createOrganization({
          body: {
            name: parsed.name,
            slug: parsed.slug,
            logo: parsed.logo,
            metadata: parsed.metadata,
            keepCurrentActiveOrganization: parsed.keepCurrentActive,
          },
          headers: buildBetterAuthHeaders(request),
          returnHeaders: true,
        });

      forwardSetCookies(headers, reply);

      if (!response) {
        throw new GraphQLError(
          'Organization creation did not return a result.',
        );
      }

      return this.mapOrganization(response);
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to create organization.');
    }
  }

  async updateOrganization(
    input: UpdateOrganizationInputType,
    userId: string,
    request: FastifyRequest,
  ): Promise<OrganizationModel | null> {
    const parsed = UpdateOrganizationSchema.parse(input);
    await this.ensureManagePermission(userId, parsed.organizationId);

    const dataPayload: Record<string, unknown> = {};
    if (parsed.name !== undefined) {
      dataPayload.name = parsed.name;
    }
    if (parsed.slug !== undefined) {
      dataPayload.slug = parsed.slug;
    }
    if (parsed.logo !== undefined) {
      dataPayload.logo = parsed.logo;
    }
    if (parsed.metadata !== undefined) {
      dataPayload.metadata = parsed.metadata ?? null;
    }

    try {
      const updated = await this.betterAuth.api.updateOrganization({
        body: {
          organizationId: parsed.organizationId,
          data: dataPayload,
        },
        headers: buildBetterAuthHeaders(request),
      });

      return updated ? this.mapOrganization(updated) : null;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to update organization.');
    }
  }

  async setActiveOrganization(
    input: SetActiveOrganizationInputType,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<boolean> {
    const parsed = SetActiveOrganizationSchema.parse(input);

    try {
      const { headers, response } = await this.betterAuth.api.setActiveOrganization({
          body: {
            organizationId: parsed.organizationId ?? undefined,
            organizationSlug: parsed.organizationSlug,
          },
          headers: buildBetterAuthHeaders(request),
          returnHeaders: true,
        });
      forwardSetCookies(headers, reply);
      const status =
        typeof response === 'object' &&
        response !== null &&
        'status' in response
          ? Boolean((response as Record<string, unknown>).status)
          : true;
      return status;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to set active organization.');
    }
  }

  async listMembers(
    organizationId: string,
    userId: string,
    request: FastifyRequest,
  ): Promise<OrganizationMemberModel[]> {
    await this.ensureMembership(userId, organizationId);

    try {
      const response = await this.betterAuth.api.listMembers({
        query: {
          organizationId,
        },
        headers: buildBetterAuthHeaders(request),
      });

      return response.members.map((member) => this.mapMember(member));
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to list organization members.');
    }
  }

  async addMember(
    input: AddOrganizationMemberInputType,
    userId: string,
    request: FastifyRequest,
  ): Promise<OrganizationMemberModel> {
    const parsed = AddOrganizationMemberSchema.parse(input);
    const organizationId =
      parsed.organizationId ??
      (await this.getActiveOrganizationId(userId, request));

    if (!organizationId) {
      throw new GraphQLError('No organization id provided to add member.');
    }

    await this.ensureManagePermission(userId, organizationId);

    try {
      const member = await this.betterAuth.api.addMember({
        body: {
          organizationId,
          userId: parsed.userId,
          role: parsed.roles,
          teamId: parsed.teamId,
        },
        headers: buildBetterAuthHeaders(request),
      });

      return this.mapMember(member);
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to add member.');
    }
  }

  async removeMember(
    input: RemoveOrganizationMemberInputType,
    userId: string,
    request: FastifyRequest,
  ): Promise<boolean> {
    const parsed = RemoveOrganizationMemberSchema.parse(input);
    const organizationId =
      parsed.organizationId ??
      (await this.getActiveOrganizationId(userId, request));

    if (!organizationId) {
      throw new GraphQLError('No organization id provided to remove member.');
    }

    await this.ensureManagePermission(userId, organizationId);

    const memberEntity = await this.findMemberEntity(
      organizationId,
      parsed.memberIdOrEmail,
    );

    if (!memberEntity) {
      throw new GraphQLError('Member not found in organization.');
    }

    await this.ensureNotLastOwner(organizationId, memberEntity);

    try {
      const result = await this.betterAuth.api.removeMember({
        body: {
          memberIdOrEmail: parsed.memberIdOrEmail,
          organizationId,
        },
        headers: buildBetterAuthHeaders(request),
      });

      const status =
        typeof result === 'object' && result !== null && 'status' in result
          ? Boolean((result as Record<string, unknown>).status)
          : true;
      return status;
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to remove member.');
    }
  }

  async updateMemberRole(
    input: UpdateOrganizationMemberRoleInputType,
    userId: string,
    request: FastifyRequest,
  ): Promise<OrganizationMemberModel> {
    const parsed = UpdateOrganizationMemberRoleSchema.parse(input);
    const organizationId =
      parsed.organizationId ??
      (await this.getActiveOrganizationId(userId, request));

    if (!organizationId) {
      throw new GraphQLError(
        'No organization id provided to update member role.',
      );
    }

    await this.ensureManagePermission(userId, organizationId);

    const memberEntity = await this.prisma.member.findUnique({
      where: { id: parsed.memberId },
    });

    if (!memberEntity) {
      throw new GraphQLError('Member not found.');
    }

    await this.ensureNotLastOwner(organizationId, memberEntity, parsed.roles);

    try {
      const updated = await this.betterAuth.api.updateMemberRole({
        body: {
          organizationId,
          memberId: parsed.memberId,
          role: parsed.roles,
        },
        headers: buildBetterAuthHeaders(request),
      });

      return this.mapMember(updated);
    } catch (error: unknown) {
      throw this.toGraphQLError(error, 'Unable to update member role.');
    }
  }

  private async ensureMembership(userId: string, organizationId: string) {
    const membership = await this.prisma.member.findFirst({
      where: { userId, organizationId },
    });

    if (!membership) {
      throw new GraphQLError('You do not belong to this organization.');
    }

    return membership;
  }

  private async ensureManagePermission(userId: string, organizationId: string) {
    const membership = await this.ensureMembership(userId, organizationId);
    const roles = this.parseRoles(membership.role);
    const allowed = this.hasAdminRole(roles);
    if (!allowed) {
      throw new GraphQLError(
        'You do not have permission to manage this organization.',
      );
    }
  }

  private async ensureNotLastOwner(
    organizationId: string,
    member: { id: string; role: string | null },
    updatedRoles?: OrganizationRole[],
  ): Promise<void> {
    const currentRoles = this.parseRoles(member.role);
    const removingOwner = currentRoles.includes(OrganizationRole.Owner);
    const futureRoles = updatedRoles ?? currentRoles;
    const willRemainOwner = futureRoles.includes(OrganizationRole.Owner);

    if (!removingOwner) {
      return;
    }

    if (updatedRoles && willRemainOwner) {
      return;
    }

    const allMembers = await this.prisma.member.findMany({
      where: { organizationId },
    });

    const remainingOwners = allMembers.filter((item) =>
      this.parseRoles(item.role).includes(OrganizationRole.Owner),
    );

    if (remainingOwners.length <= 1 && remainingOwners[0]?.id === member.id) {
      throw new GraphQLError('Organization must retain at least one owner.');
    }
  }

  private async findMemberEntity(organizationId: string, identifier: string) {
    if (this.isUuid(identifier)) {
      return this.prisma.member.findFirst({
        where: { id: identifier, organizationId },
      });
    }

    return this.prisma.member.findFirst({
      where: {
        organizationId,
        user: {
          email: identifier,
        },
      },
      include: { user: true },
    });
  }

  private async getActiveOrganizationId(
    userId: string,
    request: FastifyRequest,
  ): Promise<string | null> {
    const sessionHeaders = mergeRequestHeadersWithSetCookies(request);
    try {
      const session = await this.betterAuth.api.getSession({
        headers: sessionHeaders,
      });
      const rawSession = session?.session as Record<string, unknown> | undefined;
      const activeOrganizationId = this.readOptionalString(
        rawSession?.activeOrganizationId,
      );
      if (activeOrganizationId) {
        return activeOrganizationId;
      }
    } catch {
      /* ignore session lookup errors */
    }

    const membership = await this.prisma.member.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return membership ? membership.organizationId : null;
  }

  private mapOrganization(input: unknown): OrganizationModel {
    if (!input || typeof input !== 'object') {
      throw new Error('Invalid organization payload.');
    }

    const record = input as Record<string, unknown>;

    return {
      id: String(record.id),
      name: String(record.name ?? ''),
      slug: this.readOptionalString(record.slug),
      logo: this.readOptionalString(record.logo),
      createdAt: this.asDate(record.createdAt),
      metadata: this.safeParseMetadata(record.metadata),
    };
  }

  private mapMember(input: unknown): OrganizationMemberModel {
    if (!input || typeof input !== 'object') {
      throw new Error('Invalid member payload.');
    }

    const record = input as Record<string, unknown>;
    const roles = this.parseRoles(record.role ?? record.roles ?? []);

    if (!record.user) {
      throw new Error('Organization member payload missing user information.');
    }

    return {
      id: String(record.id),
      organizationId: String(record.organizationId ?? ''),
      userId: String(record.userId ?? ''),
      role: roles[0] ?? null,
      roles,
      createdAt: this.asDate(record.createdAt),
      user: this.userService.toUserModel(record.user),
      organization: record.organization
        ? this.mapOrganization(record.organization)
        : null,
    };
  }

  private parseRoles(input: unknown): OrganizationRole[] {
    if (!input) {
      return [];
    }

    if (Array.isArray(input)) {
      return input
        .map((value) => this.normalizeRole(value))
        .filter((role): role is OrganizationRole => role !== null);
    }

    if (typeof input === 'string') {
      return input
        .split(ORGANIZATION_ROLE_SEPARATOR)
        .map((value) => this.normalizeRole(value))
        .filter((role): role is OrganizationRole => role !== null);
    }

    return [];
  }

  private normalizeRole(value: unknown): OrganizationRole | null {
    if (typeof value !== 'string') {
      return null;
    }
    const normalized = value.trim().toLowerCase();
    return isOrganizationRole(normalized)
      ? (normalized as OrganizationRole)
      : null;
  }

  private hasAdminRole(roles: OrganizationRole[]): boolean {
    return roles.some((role) => ORGANIZATION_ADMIN_ROLES.has(role));
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

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  private toGraphQLError(
    error: unknown,
    fallbackMessage: string,
  ): GraphQLError {
    if (error instanceof GraphQLError) {
      return error;
    }

    if (error instanceof APIError) {
      const payload = error as APIError & {
        status?: unknown;
        body?: unknown;
      };
      const status = payload.status ?? 'BETTER_AUTH_ERROR';
      return new GraphQLError(error.message ?? fallbackMessage, {
        extensions: {
          code: status,
          status,
          details: payload.body ?? undefined,
        },
      });
    }

    if (error instanceof Error) {
      return new GraphQLError(error.message || fallbackMessage);
    }

    return new GraphQLError(fallbackMessage);
  }
}
