import type { Schema } from '@march1-org/db-template';
import type { UserInsert } from '@march1-org/db-template/users';
import { error } from 'elysia';
import type { DbType } from 'lib/db';

type Options = {
  db: DbType;
  schema: Schema;
  body: UserInsert;
};

export async function postUser({ db, schema: { users }, body }: Options) {
  try {
    await db.insert(users).values(body);
  } catch (e) {
    return error('Bad Request', (e as { detail: string }).detail);
  }
  return 'Successfully created user.';
}
