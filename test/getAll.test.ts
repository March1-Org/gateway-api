import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import type { app } from "@/index";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { dbBodies, schema } from "@/db/schema";
import jwt from "@elysiajs/jwt";
import { getMockCache } from "./utils/getMockCache";

let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;

beforeAll(async () => {
  const mockDb = await getMockDb();
  const mockCache = await getMockCache();
  const app = createApp({
    db: mockDb,
    dbBodies,
    schema,
    cache: mockCache,
  });

  api = treaty(app);

  authorization = await jwt({
    secret: process.env.TEMPLATE_JWT_SECRET!,
  }).decorator.jwt.sign({});

  await mockDb.delete(schema.usersTable);
  await mockDb.insert(schema.usersTable).values([
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
