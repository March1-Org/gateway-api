import type { DbType } from "@/db";
import type { Schema } from "@/db/schema";
import { type UserUpdate } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import type Redis from "ioredis";

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
  body: UserUpdate;
  cache: Redis;
};

export async function updateUser({
  db,
  schema: { usersTable },
  params: { id },
  body,
  cache,
}: Options) {
  await db
    .update(usersTable)
    .set(body)
    .where(eq(usersTable.id, Number(id)));

  const cacheKey = `user:${id}`;

  await cache.del(cacheKey);

  return "Successfully updated user.";
}
