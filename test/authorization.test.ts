import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { createApp } from "createApp";
import { schemaBodies, schema } from "db/schema";
import type { app } from "index";
import { getDb } from "db";
import { getCache } from "db/cache";

let api: ReturnType<typeof treaty<typeof app>>;

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
