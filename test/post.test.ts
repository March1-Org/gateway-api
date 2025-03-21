import { treaty } from "@elysiajs/eden";
import { describe, it, expect, beforeAll } from "bun:test";
import jwt from "@elysiajs/jwt";
import { schemaBodies, schema } from "db/schema";
import { createApp } from "createApp";
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
  await db
    .insert(schema.usersTable)
    .values([{ age: 30, email: "test@email.com", name: "test" }]);
});

describe("POST /users/", () => {
  it('returns "duplicate key value violates unique constraint "users_email_unique"" error', async () => {
    const res = await api.users.post(
      {
        age: 24,
        email: "test@email.com",
        name: "Alonzo",
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.error?.value as unknown as string).toBe(
      'duplicate key value violates unique constraint "users_email_unique"'
    );
    expect(res.error?.status as unknown as number).toBe(500);
  });

  it("returns 'Successfully created user.'", async () => {
    const res = await api.users.post(
      {
        age: 24,
        email: "test2@email.com",
        name: "Alonzo",
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.data).toBe("Successfully created user.");
    expect(res.status).toBe(200);
  });
});
