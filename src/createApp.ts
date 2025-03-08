import Elysia, { t } from "elysia";
import type { DbBodies, DbType } from "./db";
import { insertUser } from "./handlers/insertUser";
import { selectUser } from "./handlers/selectUser";
import { updateUser } from "./handlers/updateUser";
import { deleteUser } from "./handlers/deleteUser";
import type { Schema } from "./db/schema";

type Options = {
  db: DbType;
  dbBodies: DbBodies;
  schema: Schema;
};

export const createApp = ({ db, dbBodies, schema }: Options) => {
  return new Elysia()
    .decorate("db", db)
    .decorate("dbBodies", dbBodies)
    .decorate("schema", schema)
    .get("/users/:id", (options) => selectUser(options))
    .post("/users", (options) => insertUser(options), {
      body: t.Object(dbBodies.insert.usersTable),
    })
    .post("/users/:id", (options) => updateUser(options), {
      body: t.Object(dbBodies.update.usersTable),
    })
    .delete("/users/:id", (options) => deleteUser(options));
};
