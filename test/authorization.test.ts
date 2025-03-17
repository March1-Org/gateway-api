import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import type { app } from "@/index";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import { getMockCache } from "./utils/getMockCache";

let api: ReturnType<typeof treaty<typeof app>>;

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
});

describe("Authorization Checks", () => {
  it("returns 'Unauthorized' when provided the no authorization header", async () => {
    const res = await api.users.get({ query: {} });

    expect(res.error?.value as string).toBe("Unauthorized");
    expect(res.error?.status as number).toBe(401);
  });

  it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
    const res = await api.users.get({
      query: {},
      headers: {
        authorization: "",
      },
    });

    expect(res.error?.value as string).toBe("Unauthorized");
    expect(res.error?.status as number).toBe(401);
  });
});
