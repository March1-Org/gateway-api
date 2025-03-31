import type { DbType } from 'db/index';
import type { Schema } from 'db/schema';
import { eq } from 'drizzle-orm';
import type Redis from 'ioredis';

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
  cache: Redis;
};

export async function deleteUser({
  db,
  schema: { users },
  params: { id },
  cache,
}: Options) {
  await db.delete(users).where(eq(users.id, Number(id)));

  const cacheKey = `user:${id}`;

  await cache.del(cacheKey);

  return 'Successfully deleted user.';
}
