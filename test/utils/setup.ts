import { treaty } from "@elysiajs/eden";
import jwt from "@elysiajs/jwt";
import { config } from "config";
import { createApp } from "createApp";
import { getDb } from "db";
import { getCache } from "db/cache";
import { schemaBodies, schema } from "db/schema";

export async function setup() {
  const db = await getDb();
  const cache = getCache();
  const app = createApp({
    db,
    schemaBodies,
    schema,
    cache,
  });

  const api = treaty(app);

  const authorization = await jwt({
    secret: config.JWT_SECRET,
  }).decorator.jwt.sign({ apiPassword: config.API_PASSWORD });

  return { db, api, authorization };
}
