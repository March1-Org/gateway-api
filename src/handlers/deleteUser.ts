import type { DbType } from "@/db";
import type { Schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import type Redis from "ioredis";

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
  redis: Redis;
};

export async function deleteUser({
  db,
  schema: { usersTable },
  params: { id },
  redis,
}: Options) {
  await db.delete(usersTable).where(eq(usersTable.id, Number(id)));

  const cacheKey = `user:${id}`;

  await redis.del(cacheKey);

  return "Successfully deleted user.";
}
