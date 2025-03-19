import Elysia, { t } from "elysia";
import type { schemaBodies, DbType } from "./db";
import { insertUser } from "./handlers/insertUser";
import { selectUser } from "./handlers/selectUser";
import { updateUser } from "./handlers/updateUser";
import { deleteUser } from "./handlers/deleteUser";
import type { Schema } from "./db/schema";
import jwt from "@elysiajs/jwt";
import { checkAuthorization } from "./handlers/checkAuthorization";
import { selectUsers, selectUsersQuery } from "./handlers/selectUsers";
import type Redis from "ioredis";

type Options = {
  db: DbType;
  schemaBodies: schemaBodies;
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
        name: "templateJwt",
        secret: process.env.TEMPLATE_JWT_SECRET!,
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
