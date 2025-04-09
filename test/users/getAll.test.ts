import { treaty } from '@elysiajs/eden';
import { schema } from '@march1-org/db-template';
import { describe, it, expect, beforeAll } from 'bun:test';
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
  await db.insert(schema.users).values([
    { age: 30, email: 'test@email.com', name: 'test' },
    { age: 30, email: 'test2@email.com', name: 'test' },
    { age: 30, email: 'test3@email.com', name: 'test' },
  ]);
});

describe('GET /users', () => {
  it('returns an array of user rows', async () => {
    const res = await api.users.get({
      query: {},
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(3);
    expect(res.status).toBe(200);
  });

  it('returns an array of user rows from cache', async () => {
    const res = await api.users.get({
      query: {},
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(3);
    expect(res.status).toBe(200);
  });
});
