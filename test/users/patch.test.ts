import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { schema } from '@march1-org/db-template';
import { describe, it, expect, beforeAll, beforeEach } from 'bun:test';
import { eq } from 'drizzle-orm';
import type { app } from 'index';
import type { DbType } from 'lib/db';

import { setup } from '../utils/setup';

let db: DbType;
let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
  api = setupVals.api;
  authorization = setupVals.authorization;

  await db.delete(schema.users);
});

beforeEach(async () => {
  await db.delete(schema.users);
});

describe('PATCH /users/:id', () => {
  it('should return error when email violates unique constraint', async () => {
    // Create test users
    const email1 = faker.internet.email();
    const email2 = faker.internet.email();

    await db.insert(schema.users).values([
      { age: 30, email: email1, name: 'test' },
      { age: 30, email: email2, name: 'test' },
    ]);

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email2));

    const res = await api.users({ id: user.id }).patch(
      {
        age: 24,
        email: email1, // duplicate email
        name: 'Alonzo',
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.error?.value).toBe(`Key (email)=(${email1}) already exists.`);
    expect(res.error?.status).toBe(400);
  });

  it('should successfully update user with valid data', async () => {
    // Create test user
    const [user] = await db
      .insert(schema.users)
      .values({
        age: 30,
        email: faker.internet.email(),
        name: 'Original Name',
      })
      .returning();

    const updateData = {
      age: 24,
      email: faker.internet.email(),
      name: 'Updated Name',
    };

    // Update user
    const res = await api.users({ id: user.id }).patch(updateData, {
      headers: {
        authorization,
      },
    });

    expect(res.data).toBe('Successfully updated user.');
    expect(res.status).toBe(200);

    // Verify changes in database
    const [updatedUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, user.id));

    expect(updatedUser).toMatchObject(updateData);
  });

  it('should return error for non-existent user', async () => {
    const nonExistentId = 9999;
    const res = await api.users({ id: nonExistentId }).patch(
      {
        age: 24,
        email: faker.internet.email(),
        name: 'Non-existent',
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.error?.status).toBe(404);
  });
});
