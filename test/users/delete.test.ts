import { treaty } from '@elysiajs/eden';
import { describe, it, expect, beforeAll } from 'bun:test';
import type { DbType } from 'db';
import { schema } from 'db/schema';
import type { UserRow } from 'db/schema/users';
import type { app } from 'index';

import { setup } from '../utils/setup';

let db: DbType;
let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let user: UserRow;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
  api = setupVals.api;
  authorization = setupVals.authorization;

  await db.delete(schema.users);
  await db
    .insert(schema.users)
    .values({ age: 30, email: 'test@email.com', name: 'test' });

  user = (await db.select().from(schema.users))[0];
});

describe('DELETE /users/:id', () => {
  it("returns 'Successfully deleted user.'", async () => {
    const res = await api.users({ id: user.id }).delete(
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
});
