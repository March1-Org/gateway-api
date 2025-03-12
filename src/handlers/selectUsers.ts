import type { DbType } from "@/db";
import type { Schema } from "@/db/schema";
import { t } from "elysia";
import type { Static } from "@sinclair/typebox";
import type Redis from "ioredis";

export const selectUsersQuery = t.Object({
  page: t.Optional(t.Number()),
  limit: t.Optional(t.Number()),
});

type SelectUsersQueryType = Static<typeof selectUsersQuery>;

type Options = {
  db: DbType;
  schema: Schema;
  query: SelectUsersQueryType;
  redis: Redis;
};

export async function selectUsers({
  db,
  schema: { usersTable },
  query: { page = 1, limit = 10 },
  redis,
}: Options) {
  const cacheKey = `users:page:${page}:limit:${limit}`;
  const offset = (page - 1) * limit;

  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  const data = await db.select().from(usersTable).limit(limit).offset(offset);

  await redis.set(cacheKey, JSON.stringify(data), "EX", 3600);

  return data;
}
