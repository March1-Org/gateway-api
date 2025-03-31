import { treaty } from '@elysiajs/eden';
import { describe, it, expect, beforeAll } from 'bun:test';
import type { DbType } from 'db';
import { schema } from 'db/schema';
import type { app } from 'index';

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
  await db
    .insert(schema.users)
    .values([{ age: 30, email: 'test@email.com', name: 'test' }]);
});

describe('POST /users/', () => {
  it('returns "duplicate key value violates unique constraint "users_email_unique"" error', async () => {
    const res = await api.users.post(
      {
        age: 24,
        email: 'test@email.com',
        name: 'Alonzo',
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.error?.value as unknown as string).toBe(
      'duplicate key value violates unique constraint "users_email_unique"'
    );
    expect(res.error?.status as unknown as number).toBe(500);
  });

  it("returns 'Successfully created user.'", async () => {
    const res = await api.users.post(
      {
        age: 24,
        email: 'test2@email.com',
        name: 'Alonzo',
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.data).toBe('Successfully created user.');
    expect(res.status).toBe(200);
  });
});
