import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FastifyReply, FastifyRequest } from 'fastify';

import {
  AuthGuard,
  CurrentUserSession,
  type CurrentUserSession as CurrentUserSessionType,
} from '@technabit/nest-core';

import {
  AddOrganizationMemberInput,
  AddOrganizationMemberInputType,
} from './dto/add-organization-member.input';
import {
  CreateOrganizationInput,
  CreateOrganizationInputType,
} from './dto/create-organization.input';
import {
  RemoveOrganizationMemberInput,
  RemoveOrganizationMemberInputType,
} from './dto/remove-organization-member.input';
import {
  SetActiveOrganizationInput,
  SetActiveOrganizationInputType,
} from './dto/set-active-organization.input';
import {
  UpdateOrganizationMemberRoleInput,
  UpdateOrganizationMemberRoleInputType,
} from './dto/update-organization-member-role.input';
import {
  UpdateOrganizationInput,
  UpdateOrganizationInputType,
} from './dto/update-organization.input';
import { OrganizationMemberModel } from './models/organization-member.model';
import { OrganizationModel } from './models/organization.model';
import { OrganizationService } from './organization.service';

interface GraphqlContext {
  req: FastifyRequest;
  res: FastifyReply;
}

@Resolver(() => OrganizationModel)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Query(() => [OrganizationModel], { name: 'organizations' })
  @UseGuards(AuthGuard)
  async listOrganizations(
    @Context() context: GraphqlContext,
  ): Promise<OrganizationModel[]> {
    return this.organizationService.listOrganizations(context.req);
  }

  @Query(() => OrganizationModel, { name: 'organization', nullable: true })
  @UseGuards(AuthGuard)
  async getOrganization(
    @Args('id') organizationId: string,
    @CurrentUserSession() session: CurrentUserSessionType,
  ): Promise<OrganizationModel | null> {
    if (!session?.user) {
      return null;
    }
    return this.organizationService.getOrganization(
      organizationId,
      session.user.id,
    );
  }

  @Mutation(() => OrganizationModel)
  @UseGuards(AuthGuard)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput,
    @Context() context: GraphqlContext,
  ): Promise<OrganizationModel> {
    return this.organizationService.createOrganization(
      input as CreateOrganizationInputType,
      context.req,
      context.res,
    );
  }

  @Mutation(() => OrganizationModel, { nullable: true })
  @UseGuards(AuthGuard)
  async updateOrganization(
    @Args('input') input: UpdateOrganizationInput,
    @CurrentUserSession() session: CurrentUserSessionType,
    @Context() context: GraphqlContext,
  ): Promise<OrganizationModel | null> {
    if (!session?.user) {
      return null;
    }
    return this.organizationService.updateOrganization(
      input as UpdateOrganizationInputType,
      session.user.id,
      context.req,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async setActiveOrganization(
    @Args('input') input: SetActiveOrganizationInput,
    @Context() context: GraphqlContext,
  ): Promise<boolean> {
    return this.organizationService.setActiveOrganization(
      input as SetActiveOrganizationInputType,
      context.req,
      context.res,
    );
  }

  @Mutation(() => OrganizationMemberModel)
  @UseGuards(AuthGuard)
  async addOrganizationMember(
    @Args('input') input: AddOrganizationMemberInput,
    @CurrentUserSession() session: CurrentUserSessionType,
    @Context() context: GraphqlContext,
  ): Promise<OrganizationMemberModel> {
    if (!session?.user) {
      throw new Error('Unauthenticated.');
    }
    return this.organizationService.addMember(
      input as AddOrganizationMemberInputType,
      session.user.id,
      context.req,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async removeOrganizationMember(
    @Args('input') input: RemoveOrganizationMemberInput,
    @CurrentUserSession() session: CurrentUserSessionType,
    @Context() context: GraphqlContext,
  ): Promise<boolean> {
    if (!session?.user) {
      throw new Error('Unauthenticated.');
    }
    return this.organizationService.removeMember(
      input as RemoveOrganizationMemberInputType,
      session.user.id,
      context.req,
    );
  }

  @Mutation(() => OrganizationMemberModel)
  @UseGuards(AuthGuard)
  async updateOrganizationMemberRole(
    @Args('input') input: UpdateOrganizationMemberRoleInput,
    @CurrentUserSession() session: CurrentUserSessionType,
    @Context() context: GraphqlContext,
  ): Promise<OrganizationMemberModel> {
    if (!session?.user) {
      throw new Error('Unauthenticated.');
    }
    return this.organizationService.updateMemberRole(
      input as UpdateOrganizationMemberRoleInputType,
      session.user.id,
      context.req,
    );
  }

  @ResolveField(() => [OrganizationMemberModel], { nullable: true })
  @UseGuards(AuthGuard)
  async members(
    @Parent() organization: OrganizationModel,
    @CurrentUserSession() session: CurrentUserSessionType,
    @Context() context: GraphqlContext,
  ): Promise<OrganizationMemberModel[]> {
    if (!session?.user) {
      return [];
    }
    return this.organizationService.listMembers(
      organization.id,
      session.user.id,
      context.req,
    );
  }
}
