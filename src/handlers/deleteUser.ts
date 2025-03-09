import type { DbType } from "@/db";
import type { Schema } from "@/db/schema";
import { eq } from "drizzle-orm";

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
};

export async function deleteUser({
  db,
  schema: { usersTable },
  params: { id },
}: Options) {
  await db.delete(usersTable).where(eq(usersTable.id, Number(id)));

  return "Successfully deleted user.";
}
