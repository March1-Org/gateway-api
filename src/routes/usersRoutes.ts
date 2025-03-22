import type { DbType } from "db";
import type { SchemaBodies, Schema } from "db/schema";
import Elysia, { t } from "elysia";
import type Redis from "ioredis";
import { deleteUser } from "handlers/users/deleteUser";
import { insertUser } from "handlers/users/insertUser";
import { selectUser } from "handlers/users/selectUser";
import { selectUsers, selectUsersQuery } from "handlers/users/selectUsers";
import { updateUser } from "handlers/users/updateUser";

type Options = {
  db: DbType;
  schemaBodies: SchemaBodies;
  schema: Schema;
  cache: Redis;
};

export async function userRoutes({ db, schemaBodies, schema, cache }: Options) {
  return new Elysia({ prefix: "/users" })
    .decorate("db", db)
    .decorate("schemaBodies", schemaBodies)
    .decorate("schema", schema)
    .decorate("cache", cache)
    .get("", (options) => selectUsers(options), {
      query: selectUsersQuery,
      detail: {
        summary: "Selects users in a page",
      },
    })
    .get("/:id", (options) => selectUser(options))
    .post("", (options) => insertUser(options), {
      body: t.Object(schemaBodies.insert.usersTable),
    })
    .patch("/:id", (options) => updateUser(options), {
      body: t.Object(schemaBodies.update.usersTable),
    })
    .delete("/:id", (options) => deleteUser(options));
}
