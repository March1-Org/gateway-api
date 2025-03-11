import type { DbType } from "@/db";
import type { Schema } from "@/db/schema";

type Options = {
  db: DbType;
  schema: Schema;
};

export async function selectAllUsers({ db, schema: { usersTable } }: Options) {
  const res = await db.select().from(usersTable);

  return res;
}
