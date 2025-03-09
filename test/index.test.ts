import { createApp } from "@/createApp";
import { treaty } from "@elysiajs/eden";
import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestDb } from "./utils/mockDb";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import type { app } from "@/index";
import jwt from "@elysiajs/jwt";

type TestApp = typeof app;

// Define the return type of getTestDb()
type TestDb = Awaited<ReturnType<typeof getTestDb>>;

// Define the return type of treaty()
type TreatyApi = ReturnType<typeof treaty<typeof app>>;

// Define the test context with proper types
interface TestContext {
  db: TestDb;
  app: TestApp;
  api: TreatyApi;
  authorization: string;
}

describe("Users API", () => {
  // Initialize with proper types
  const testContext: TestContext = {
    db: undefined as unknown as TestDb,
    app: undefined as unknown as TestApp,
    api: undefined as unknown as TreatyApi,
    authorization: undefined as unknown as string,
  };

  // Setup before all tests
  beforeAll(async () => {
    // Set the actual values
    testContext.db = await getTestDb();
    testContext.app = createApp({
      db: testContext.db.mockDb,
      dbBodies,
      schema,
    });
    testContext.api = treaty(testContext.app);
    testContext.authorization = await jwt({
      secret: process.env.TEMPLATE_JWT_SECRET!,
    }).decorator.jwt.sign({});

    await testContext.api.users.post(
      {
        age: 24,
        email: "test.email@.com",
        name: "Alonzo",
      },
      {
        headers: {
          authorization: testContext.authorization,
        },
      }
    );
  });

  // Clean up after tests
  afterAll(async () => {
    if (testContext.db && "disconnect" in testContext.db) {
      await testContext.db.container.stop();
    }
  });

  describe("GET /users/:id", () => {
    it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
      const userId = 1;

      const res = await testContext.api.users({ id: userId }).get({
        headers: {
          authorization: "",
        },
      });

      expect(res.error?.value as string).toBe("Unauthorized");
      expect(res.error?.status as number).toBe(401);
    });

    it("returns 'User not found' error when user doesn't exist", async () => {
      const userId = 2;

      const res = await testContext.api.users({ id: userId }).get({
        headers: {
          authorization: testContext.authorization,
        },
      });

      expect(res.error?.value).toBe("User not found.");
      expect(res.error?.status).toBe(404);
    });

    it("returns user row", async () => {
      const userId = 1;

      const res = await testContext.api.users({ id: userId }).get({
        headers: {
          authorization: testContext.authorization,
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

  describe("POST /users/", () => {
    it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
      const res = await testContext.api.users.post(
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
      const res = await testContext.api.users.post(
        {
          age: 24,
          email: "test.email@.com",
          name: "Alonzo",
        },
        {
          headers: {
            authorization: testContext.authorization,
          },
        }
      );

      expect(res.error?.value as unknown as string).toBe(
        'duplicate key value violates unique constraint "users_email_unique"'
      );
      expect(res.error?.status as unknown as number).toBe(500);
    });

    it("returns 'Successfully created user.'", async () => {
      const res = await testContext.api.users.post(
        {
          age: 24,
          email: "test2.email@.com",
          name: "Alonzo",
        },
        {
          headers: {
            authorization: testContext.authorization,
          },
        }
      );

      expect(res.data).toBe("Successfully created user.");
      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /users/:id", () => {
    it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
      const res = await testContext.api.users({ id: 1 }).patch(
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
      const res = await testContext.api.users({ id: 1 }).patch(
        {
          age: 25,
          email: "test2.email@.com",
          name: "Alonzo S.",
        },
        {
          headers: {
            authorization: testContext.authorization,
          },
        }
      );

      expect(res.error?.value as unknown as string).toBe(
        'duplicate key value violates unique constraint "users_email_unique"'
      );
      expect(res.error?.status as unknown as number).toBe(500);
    });

    it("returns 'Successfully created user.'", async () => {
      const res = await testContext.api.users({ id: 1 }).patch(
        {
          age: 25,
          email: "test3.email@.com",
          name: "Alonzo S.",
        },
        {
          headers: {
            authorization: testContext.authorization,
          },
        }
      );

      expect(res.data).toBe("Successfully updated user.");
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /users/:id", () => {
    it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
      const res = await testContext.api.users({ id: 1 }).delete({
        headers: {
          authorization: "",
        },
      });

      expect(res.error?.value as unknown as string).toBe("Unauthorized");
      expect(res.error?.status as number).toBe(401);
    });
  });

  it("returns 'Successfully deleted user.'", async () => {
    const res = await testContext.api.users({ id: 3 }).delete(
      {},
      {
        headers: {
          authorization: testContext.authorization,
        },
      }
    );

    expect(res.data).toBe("Successfully deleted user.");
    expect(res.status).toBe(200);
  });
});
