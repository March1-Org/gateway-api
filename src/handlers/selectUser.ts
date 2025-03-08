import type { DbType } from "@/db";
import type { Schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { error } from "elysia";

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
};

export async function selectUser({
  db,
  schema: { usersTable },
  params: { id },
}: Options) {
  const res = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, Number(id)));

  if (!res.length) {
    return error("No Content", "User not found.");
  }

  return res[0];
}
