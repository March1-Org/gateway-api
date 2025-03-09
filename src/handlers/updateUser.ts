import type { DbType } from "@/db";
import type { Schema } from "@/db/schema";
import { type UserUpdate } from "@/db/schema/users";
import { eq } from "drizzle-orm";

type Options = {
  db: DbType;
  schema: Schema;
  params: { id: string };
  body: UserUpdate;
};

export async function updateUser({
  db,
  schema: { usersTable },
  params: { id },
  body,
}: Options) {
  await db
    .update(usersTable)
    .set(body)
    .where(eq(usersTable.id, Number(id)));

  return "Successfully updated user.";
}
