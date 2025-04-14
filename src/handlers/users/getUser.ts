import type { Schema } from '@march1-org/db-template';
import { eq } from 'drizzle-orm';
import { error } from 'elysia';
import type Redis from 'ioredis';
import type { DbType } from 'lib/db';
import type { UserResult } from 'utils/types/user';

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
  cache: Redis;
};

export async function getUser({
  db,
  schema: { users },
  params: { id },
  cache,
}: Options) {
  const cacheKey = `user:${id}`;

  const cachedUser = await cache.get(cacheKey);

  if (cachedUser) {
    return JSON.parse(cachedUser) as UserResult;
  }

  const data = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  if (!data.length) {
    return error('Not Found', 'User not found.');
  }

  const user = data[0];

  const normUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt?.toISOString() ?? null,
    deletedAt: user.deletedAt?.toISOString() ?? null,
  };

  await cache.set(cacheKey, JSON.stringify(normUser), 'EX', 3600);

  return normUser;
}
