import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import type { app } from "@/index";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";

let api: ReturnType<typeof treaty<typeof app>>;

describe("Authorization Checks", () => {
  beforeAll(async () => {
    const mockDb = await getMockDb();
    const app = createApp({
      db: mockDb,
      dbBodies,
      schema,
    });

    api = treaty(app);
  });

  it("returns 'Unauthorized' when provided the no authorization header", async () => {
    const res = await api.users.get();

    expect(res.error?.value as string).toBe("Unauthorized");
    expect(res.error?.status as number).toBe(401);
  });

  it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
    const res = await api.users.get({
      headers: {
        authorization: "",
      },
    });

    expect(res.error?.value as string).toBe("Unauthorized");
    expect(res.error?.status as number).toBe(401);
  });
});
