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
});

beforeEach(async () => {
  await db.delete(schema.users);
});

describe('POST /users/', () => {
  it('should return error when email violates unique constraint', async () => {
    // Create test user with known email
    const existingEmail = faker.internet.email();
    await db.insert(schema.users).values({
      age: 30,
      email: existingEmail,
      name: 'Existing User',
    });

    // Attempt to create user with duplicate email
    const res = await api.users.post(
      {
        age: 24,
        email: existingEmail,
        name: 'Duplicate Email User',
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.error?.value).toBe(
      `Key (email)=(${existingEmail}) already exists.`
    );
    expect(res.error?.status).toBe(400);
  });

  it('should successfully create user with valid data', async () => {
    const userData = {
      age: 24,
      email: faker.internet.email(),
      name: 'New User',
    };

    // Create new user
    const res = await api.users.post(userData, {
      headers: {
        authorization,
      },
    });

    expect(res.data).toBe('Successfully created user.');
    expect(res.status).toBe(200);

    // Verify user was created in database
    const [createdUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, userData.email));

    expect(createdUser).toMatchObject(userData);
  });
});
