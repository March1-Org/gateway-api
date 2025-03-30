import type { Static } from '@sinclair/typebox';
import type { DbType } from 'db';
import type { Schema } from 'db/schema';
import { t } from 'elysia';
import type Redis from 'ioredis';

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
  schema: { usersTable },
  query: { page = 1, limit = 10 },
  cache,
}: Options) {
  const cacheKey = `users:page:${page}:limit:${limit}`;
  const offset = (page - 1) * limit;

  const cachedResult = await cache.get(cacheKey);

  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  const data = await db.select().from(usersTable).limit(limit).offset(offset);

  await cache.set(cacheKey, JSON.stringify(data), 'EX', 3600);

  return data;
}
