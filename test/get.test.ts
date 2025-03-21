import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import jwt from "@elysiajs/jwt";
import { createApp } from "createApp";
import { schemaBodies, schema } from "db/schema";
import type { UserRow } from "db/schema/users";
import { config } from "config";
import type { app } from "index";
import { getDb } from "db";
import { getCache } from "db/cache";

let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let user: UserRow;

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
  await db
    .insert(schema.usersTable)
    .values({ age: 30, email: "test@email.com", name: "test" });

  user = (await db.select().from(schema.usersTable))[0];
});

describe("GET /users/:id", () => {
  it("returns 'User not found' error when user doesn't exist", async () => {
    const res = await api.users({ id: 999999 }).get({
      headers: {
        authorization,
      },
    });

    expect(res.error?.value).toBe("User not found.");
    expect(res.error?.status).toBe(404);
  });

  it("returns user row", async () => {
    const res = await api.users({ id: user.id }).get({
      headers: {
        authorization,
      },
    });

    expect(res.data).toEqual(user);
    expect(res.status).toBe(200);
  });
});
