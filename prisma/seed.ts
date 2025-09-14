/*
  Prisma seed script (Phase 1-2)
  Creates an initial admin user and account, mirroring TypeORM seed behavior.
*/
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Idempotent: find existing admin by email
  const adminEmail = 'admin@admin.com';

  const existing = await prisma.user.findFirst({
    where: { email: adminEmail, deletedAt: null },
    select: { id: true },
  });

  let userId = existing?.id;
  if (!userId) {
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        email: adminEmail,
        role: Role.Admin,
        isEmailVerified: true,
      },
      select: { id: true },
    });
    userId = user.id;
  }

  // Ensure there is an account row for credential provider
  const account = await prisma.account.findFirst({
    where: { userId, providerId: 'credential' },
    select: { id: true },
  });
  if (!account) {
    await prisma.account.create({
      data: {
        userId,
        accountId: userId!,
        providerId: 'credential',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

