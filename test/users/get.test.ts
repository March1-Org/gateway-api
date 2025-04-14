import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { schema } from '@march1-org/db-template';
import { describe, it, expect, beforeAll, beforeEach } from 'bun:test';
import type { app } from 'index';
import type { DbType } from 'lib/db';
import type { UserResult } from 'utils/types/user';

import { setup } from '../utils/setup';

let db: DbType;
let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let testUser: UserResult;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
  api = setupVals.api;
  authorization = setupVals.authorization;

  await db.delete(schema.users);
});

beforeEach(async () => {
  await db.delete(schema.users);
  const mockUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 99 }),
  };
  const user = (await db.insert(schema.users).values(mockUser).returning())[0];
  testUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: null,
    deletedAt: null,
  };
});

describe('GET /users/:id', () => {
  it("returns 'User not found' error when user doesn't exist", async () => {
    const res = await api.users({ id: 999999 }).get({
      headers: {
        authorization,
      },
    });

    expect(res.error?.value).toBe('User not found.');
    expect(res.error?.status).toBe(404);
  });

  it('returns user row', async () => {
    const res = await api.users({ id: testUser.id }).get({
      headers: {
        authorization,
      },
    });

    if (!res.data) throw Error();

    expect(res.data).toEqual(testUser);
    expect(res.status).toBe(200);
  });

  it('returns user row from cache', async () => {
    const res = await api.users({ id: testUser.id }).get({
      headers: {
        authorization,
      },
    });

    expect(res.data).toEqual(testUser);
    expect(res.status).toBe(200);
  });
});
