import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import type Redis from "ioredis";
import { config } from "config";
import type { DbType } from "db";
import type { SchemaBodies, Schema } from "db/schema";
import { checkAuthorization } from "handlers/checkAuthorization";
import { userRoutes } from "routes/usersRoutes";

type Options = {
  db: DbType;
  schemaBodies: SchemaBodies;
  schema: Schema;
  cache: Redis;
};

export function createApp({ db, schemaBodies, schema, cache }: Options) {
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
    .use(userRoutes({ db, schemaBodies, schema, cache }));
}
