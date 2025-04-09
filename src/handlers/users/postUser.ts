import type { Schema } from '@march1-org/db-template';
import type { UserInsert } from '@march1-org/db-template/users';
import type { DbType } from 'lib/db';

type Options = {
  db: DbType;
  schema: Schema;
  body: UserInsert;
};

export async function postUser({ db, schema: { users }, body }: Options) {
  await db.insert(users).values(body);
  return 'Successfully created user.';
}
