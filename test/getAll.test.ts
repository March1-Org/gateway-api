import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import jwt from "@elysiajs/jwt";
import { createApp } from "createApp";
import { schemaBodies, schema } from "db/schema";
import { config } from "config";
import type { app } from "index";
import { getDb } from "db";
import { getCache } from "db/cache";

let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;

beforeAll(async () => {
  const db = await getDb();
  const cache = getCache();
  const app = createApp({
    db,
    schemaBodies,
    schema,
    cache,
  });

  api = treaty(app);

  authorization = await jwt({
    secret: config.JWT_SECRET,
  }).decorator.jwt.sign({});

  await db.delete(schema.usersTable);
  await db.insert(schema.usersTable).values([
    { age: 30, email: "test@email.com", name: "test" },
    { age: 30, email: "test2@email.com", name: "test" },
    { age: 30, email: "test3@email.com", name: "test" },
  ]);
});

describe("GET /users", () => {
  it("returns an array of user rows", async () => {
    const res = await api.users.get({
      query: {},
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(3);
    expect(res.status).toBe(200);
  });
});
