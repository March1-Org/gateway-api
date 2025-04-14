import type { Schema } from '@march1-org/db-template';
import type { UserUpdate } from '@march1-org/db-template/users';
import { eq } from 'drizzle-orm';
import { error } from 'elysia';
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
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  if (user.length === 0) {
    return error('Not Found');
  }

  try {
    await db
      .update(users)
      .set(body)
      .where(eq(users.id, Number(id)));
  } catch (e) {
    return error('Bad Request', (e as { detail: string }).detail);
  }

  const cacheKey = `user:${id}`;

  await cache.del(cacheKey);

  return 'Successfully updated user.';
}
