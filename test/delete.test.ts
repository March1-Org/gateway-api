import type { app } from "@/index";
import { treaty } from "@elysiajs/eden";
import { describe, it, expect, beforeAll } from "bun:test";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { schemaBodies, schema } from "@/db/schema";
import jwt from "@elysiajs/jwt";
import type { UserRow } from "@/db/schema/users";
import { getMockCache } from "./utils/getMockCache";

let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let user: UserRow;

beforeAll(async () => {
  const mockDb = await getMockDb();
  const mockCache = await getMockCache();
  const app = createApp({
    db: mockDb,
    schemaBodies,
    schema,
    cache: mockCache,
  });

  api = treaty(app);

  authorization = await jwt({
    secret: process.env.TEMPLATE_JWT_SECRET!,
  }).decorator.jwt.sign({});

  await mockDb.delete(schema.usersTable);
  await mockDb
    .insert(schema.usersTable)
    .values({ age: 30, email: "test@email.com", name: "test" });

  user = (await mockDb.select().from(schema.usersTable))[0];
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
