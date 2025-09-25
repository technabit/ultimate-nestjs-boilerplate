/*
  Prisma seed script (Admins-only)
  Creates 5 platform admins using the Better Auth API so credentials are fully compatible.
*/
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v7 as uuidv7 } from 'uuid';

const prisma = new PrismaClient() as any;

function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function signUpEmail({ baseUrl, email, password, name }: { baseUrl: string; email: string; password: string; name: string; }) {
  const res = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`sign-up failed ${res.status}: ${txt}`);
  }
  return res.json();
}

async function main() {
  const baseUrl = process.env.APP_URL || 'http://localhost:8000';
  const password = 'Demo123456';

  // Only create 5 platform admins via API
  const adminEmails: string[] = [];
  for (let i = 0; i < 5; i++) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const email = `${slugify(first)}.${slugify(last)}+${uuidv7().slice(0, 8)}@example.com`;
    const name = `${first} ${last}`;
    adminEmails.push(email);
    await signUpEmail({ baseUrl, email, password, name }).catch((e) => {
      console.error('Admin signup error', email, e.message);
    });
  }

  // Promote to PLATFORM_ADMIN and ensure verified
  const admins = await prisma.user.findMany({ where: { email: { in: adminEmails } } });
  await Promise.all(
    admins.map((u: any) =>
      prisma.user.update({ where: { id: u.id }, data: { role: 'PLATFORM_ADMIN', emailVerified: true } }),
    ),
  );

  console.log('Seeded platform admins:', adminEmails);
}

main()
  .then(async () => {
    await prisma.$disconnect?.();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect?.();
    process.exit(1);
  });
