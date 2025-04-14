import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { schema } from '@march1-org/db-template';
import type { UserRow } from '@march1-org/db-template/users';
import { describe, it, expect, beforeAll, beforeEach } from 'bun:test';
import type { app } from 'index';
import type { DbType } from 'lib/db';

import { setup } from '../utils/setup';

let db: DbType;
let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let testUser: UserRow;

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
  testUser = (await db.insert(schema.users).values(mockUser).returning())[0];
});

describe('DELETE /users/:id', () => {
  it("returns 'Successfully deleted user.'", async () => {
    const res = await api.users({ id: testUser.id }).delete(
      {},
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.data).toBe('Successfully deleted user.');
    expect(res.status).toBe(200);
  });

  it('should return error for non-existent user', async () => {
    const nonExistentId = 9999;
    const res = await api.users({ id: nonExistentId }).delete(
      {},
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.error?.status).toBe(404);
  });
});
