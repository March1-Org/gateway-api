import { treaty } from "@elysiajs/eden";
import { describe, it, expect, beforeAll } from "bun:test";
import { eq } from "drizzle-orm";
import { schema } from "db/schema";
import type { UserRow } from "db/schema/users";
import type { app } from "index";
import type { DbType } from "db";
import { setup } from "../utils/setup";

let db: DbType;
let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let user: UserRow;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
  api = setupVals.api;
  authorization = setupVals.authorization;

  await db.delete(schema.usersTable);
  await db.insert(schema.usersTable).values([
    { age: 30, email: "test@email.com", name: "test" },
    { age: 30, email: "test2@email.com", name: "test" },
  ]);

  user = (
    await db
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
