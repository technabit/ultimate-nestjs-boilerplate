import { registerEnumType } from '@nestjs/graphql';

export enum OrganizationRole {
  Owner = 'owner',
  Admin = 'admin',
  Instructor = 'instructor',
  Student = 'student',
  Guest = 'guest',
  // --
  Member = 'member', // => fallback
}

registerEnumType(OrganizationRole, { name: 'OrganizationRole' });

export const ORGANIZATION_ROLE_SEPARATOR = ',';
export const ORGANIZATION_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ORGANIZATION_ROLE_VALUES = new Set<OrganizationRole>(
  Object.values(OrganizationRole),
);

export const ORGANIZATION_ADMIN_ROLES = new Set<OrganizationRole>([
  OrganizationRole.Owner,
  OrganizationRole.Admin,
]);

export const isOrganizationRole = (value: unknown): value is OrganizationRole =>
  typeof value === 'string' &&
  ORGANIZATION_ROLE_VALUES.has(value as OrganizationRole);
