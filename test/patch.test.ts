import type { app } from "@/index";
import { treaty } from "@elysiajs/eden";
import { describe, it, expect, beforeAll } from "bun:test";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import jwt from "@elysiajs/jwt";

let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;

describe("PATCH /users/:id", () => {
  beforeAll(async () => {
    try {
      const mockDb = await getMockDb();
      const app = createApp({
        db: mockDb,
        dbBodies,
        schema,
      });

      api = treaty(app);

      authorization = await jwt({
        secret: process.env.TEMPLATE_JWT_SECRET!,
      }).decorator.jwt.sign({});
    } catch (error) {
      console.error("Error in beforeAll:", error);
    }
  });

  it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
    const res = await api.users({ id: 1 }).patch(
      {
        age: 24,
        email: "test.email@.com",
        name: "Alonzo",
      },
      {
        headers: {
          authorization: "",
        },
      }
    );

    expect(res.error?.value as unknown as string).toBe("Unauthorized");
    expect(res.error?.status as number).toBe(401);
  });

  it('returns "duplicate key value violates unique constraint "users_email_unique"" error', async () => {
    const res = await api.users({ id: 1 }).patch(
      {
        age: 25,
        email: "test2.email@.com",
        name: "Alonzo S.",
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
    const res = await api.users({ id: 1 }).patch(
      {
        age: 25,
        email: "test3.email@.com",
        name: "Alonzo S.",
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
