import { describe, it, expect, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import type { app } from "@/index";
import { getMockDb } from "./utils/getMockDb";
import { createApp } from "@/createApp";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import jwt from "@elysiajs/jwt";

let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;

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

describe("GET /users/:id", () => {
  it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
    if (!api) {
      throw new Error("api is not defined");
    }

    const userId = 1;

    const res = await api.users({ id: userId }).get({
      headers: {
        authorization: "",
      },
    });

    expect(res.error?.value as string).toBe("Unauthorized");
    expect(res.error?.status as number).toBe(401);
  });

  it("returns 'User not found' error when user doesn't exist", async () => {
    if (!api) {
      throw new Error("api is not defined");
    }

    const userId = 2;

    const res = await api.users({ id: userId }).get({
      headers: {
        authorization,
      },
    });

    expect(res.error?.value).toBe("User not found.");
    expect(res.error?.status).toBe(404);
  });

  it("returns user row", async () => {
    if (!api) {
      throw new Error("api is not defined");
    }

    const userId = 1;

    const res = await api.users({ id: userId }).get({
      headers: {
        authorization,
      },
    });

    expect(res.data).toEqual({
      id: 1,
      age: 24,
      email: "test.email@.com",
      name: "Alonzo",
    });
    expect(res.status).toBe(200);
    expect(res.error).toBeNull();
  });
});
