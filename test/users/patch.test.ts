import { treaty } from '@elysiajs/eden';
import { schema } from '@march1-org/db-template';
import type { UserRow } from '@march1-org/db-template/users';
import { describe, it, expect, beforeAll } from 'bun:test';
import { eq } from 'drizzle-orm';
import type { app } from 'index';
import type { DbType } from 'lib/db';

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
  await db.insert(schema.users).values([
    { age: 30, email: 'test@email.com', name: 'test' },
    { age: 30, email: 'test2@email.com', name: 'test' },
  ]);

  user = (
    await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'test2@email.com'))
  )[0];
});

describe('PATCH /users/:id', () => {
  it('returns "duplicate key value violates unique constraint "users_email_unique"" error', async () => {
    const res = await api.users({ id: user.id }).patch(
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
    const res = await api.users({ id: user.id }).patch(
      {
        age: 24,
        email: 'test.email@.com',
        name: 'Alonzo',
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.data).toBe('Successfully updated user.');
    expect(res.status).toBe(200);
  });
});
