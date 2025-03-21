import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";
import type Redis from "ioredis";
import { config } from "config";
import type { DbType } from "db";
import type { SchemaBodies, Schema } from "db/schema";
import { checkAuthorization } from "handlers/checkAuthorization";
import { deleteUser } from "handlers/deleteUser";
import { insertUser } from "handlers/insertUser";
import { selectUser } from "handlers/selectUser";
import { selectUsers, selectUsersQuery } from "handlers/selectUsers";
import { updateUser } from "handlers/updateUser";

type Options = {
  db: DbType;
  schemaBodies: SchemaBodies;
  schema: Schema;
  cache: Redis;
};

export const createApp = ({ db, schemaBodies, schema, cache }: Options) => {
  return new Elysia()
    .decorate("db", db)
    .decorate("schemaBodies", schemaBodies)
    .decorate("schema", schema)
    .decorate("cache", cache)
    .use(
      jwt({
        secret: config.JWT_SECRET!,
      })
    )
    .onBeforeHandle((options) => checkAuthorization(options))
    .get("/users", (options) => selectUsers(options), {
      query: selectUsersQuery,
      detail: {
        summary: "Selects users in a page",
      },
    })
    .get("/users/:id", (options) => selectUser(options))
    .post("/users", (options) => insertUser(options), {
      body: t.Object(schemaBodies.insert.usersTable),
    })
    .patch("/users/:id", (options) => updateUser(options), {
      body: t.Object(schemaBodies.update.usersTable),
    })
    .delete("/users/:id", (options) => deleteUser(options));
};
