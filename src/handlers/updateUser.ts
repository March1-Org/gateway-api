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
  redis: Redis;
};

export async function updateUser({
  db,
  schema: { usersTable },
  params: { id },
  body,
  redis,
}: Options) {
  await db
    .update(usersTable)
    .set(body)
    .where(eq(usersTable.id, Number(id)));

  const cacheKey = `user:${id}`;

  await redis.del(cacheKey);

  return "Successfully updated user.";
}
