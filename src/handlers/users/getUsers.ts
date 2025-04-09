import type { Schema } from '@march1-org/db-template';
import type { Static } from '@sinclair/typebox';
import { t } from 'elysia';
import type Redis from 'ioredis';
import type { DbType } from 'lib/db';

export const getUsersQuery = t.Object({
  page: t.Optional(t.Number()),
  limit: t.Optional(t.Number()),
});

type GetUsersQueryType = Static<typeof getUsersQuery>;

type Options = {
  db: DbType;
  schema: Schema;
  query: GetUsersQueryType;
  cache: Redis;
};

export async function getUsers({
  db,
  schema: { users },
  query: { page = 1, limit = 10 },
  cache,
}: Options) {
  const cacheKey = `users:page:${page}:limit:${limit}`;
  const offset = (page - 1) * limit;

  const cachedResult = await cache.get(cacheKey);

  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  const data = await db.select().from(users).limit(limit).offset(offset);

  await cache.set(cacheKey, JSON.stringify(data), 'EX', 3600);

  return data;
}
