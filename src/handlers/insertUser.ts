import type { DbType } from "db";
import type { Schema } from "db/schema";
import type { UserInsert } from "db/schema/users";

type Options = {
  db: DbType;
  schema: Schema;
  body: UserInsert;
};

export async function insertUser({
  db,
  schema: { usersTable },
  body,
}: Options) {
  await db.insert(usersTable).values(body);
  return "Successfully created user.";
}
