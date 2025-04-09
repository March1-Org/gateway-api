import type { Schema } from '@march1-org/db-template';
import type { UserUpdate } from '@march1-org/db-template/users';
import { eq } from 'drizzle-orm';
import type Redis from 'ioredis';
import type { DbType } from 'lib/db';

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
  body: UserUpdate;
  cache: Redis;
};

export async function patchUser({
  db,
  schema: { users },
  params: { id },
  body,
  cache,
}: Options) {
  await db
    .update(users)
    .set(body)
    .where(eq(users.id, Number(id)));

  const cacheKey = `user:${id}`;

  await cache.del(cacheKey);

  return 'Successfully updated user.';
}
