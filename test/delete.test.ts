import { treaty } from "@elysiajs/eden";
import { describe, it, expect, beforeAll } from "bun:test";
import jwt from "@elysiajs/jwt";
import type { UserRow } from "db/schema/users";
import { createApp } from "createApp";
import { getDb } from "db";
import { getCache } from "db/cache";
import { schemaBodies, schema } from "db/schema";
import type { app } from "index";
import { config } from "config";

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

describe("DELETE /users/:id", () => {
  it("returns 'Successfully deleted user.'", async () => {
    const res = await api.users({ id: user.id }).delete(
      {},
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.data).toBe("Successfully deleted user.");
    expect(res.status).toBe(200);
  });
});
