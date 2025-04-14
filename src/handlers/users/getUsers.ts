import type { Schema } from '@march1-org/db-template';
import type { Static } from '@sinclair/typebox';
import { error, t } from 'elysia';
import type Redis from 'ioredis';
import type { DbType } from 'lib/db';
import type { UserResult } from 'utils/types/user';

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
  if (isNaN(page) || !Number.isInteger(page) || page < 1) {
    return error('Bad Request', 'Page must be a positive integer');
  }

  if (isNaN(limit) || !Number.isInteger(limit) || limit < 1) {
    return error('Bad Request', 'Limit must be a positive integer');
  }

  const cacheKey = `users:page:${page}:limit:${limit}`;
  const offset = (page - 1) * limit;

  const cachedResult = await cache.get(cacheKey);

  if (cachedResult) {
    return JSON.parse(cachedResult) as UserResult[];
  }

  const data = await db.select().from(users).limit(limit).offset(offset);

  const normData = data.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt?.toISOString() ?? null,
    deletedAt: user.deletedAt?.toISOString() ?? null,
  }));

  await cache.set(cacheKey, JSON.stringify(normData), 'EX', 3600);

  return normData;
}
