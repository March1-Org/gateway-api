import type { app } from "@/index";
import { treaty } from "@elysiajs/eden";
import { describe, it, expect, beforeAll } from "bun:test";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { dbBodies, schema } from "@/db/schema";
import jwt from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
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
  ]);

  user = (
    await mockDb
      .select()
      .from(schema.usersTable)
      .where(eq(schema.usersTable.email, "test2@email.com"))
  )[0];
});

describe("PATCH /users/:id", () => {
  it('returns "duplicate key value violates unique constraint "users_email_unique"" error', async () => {
    const res = await api.users({ id: user.id }).patch(
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
    const res = await api.users({ id: user.id }).patch(
      {
        age: 24,
        email: "test.email@.com",
        name: "Alonzo",
      },
      {
        headers: {
          authorization,
        },
      }
    );

    expect(res.data).toBe("Successfully updated user.");
    expect(res.status).toBe(200);
  });
});
