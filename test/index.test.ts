import { createApp } from "@/createApp";
import { treaty } from "@elysiajs/eden";
import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { getTestDb } from "./utils/mockDb";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import type { app } from "@/index";

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
}

describe("Users API", () => {
  // Initialize with proper types
  const testContext: TestContext = {
    db: undefined as unknown as TestDb,
    app: undefined as unknown as TestApp,
    api: undefined as unknown as TreatyApi,
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
  });

  // Clean up after tests
  afterAll(async () => {
    if (testContext.db && "disconnect" in testContext.db) {
      await testContext.db.container.stop();
    }
  });

  describe("GET /users/:id", () => {
    it("returns 'User not found' error when user doesn't exist", async () => {
      // Arrange
      const userId = 1;

      // Act
      const { data, error } = await testContext.api.users({ id: userId }).get();

      // Assert
      expect(data).toBeUndefined();
      expect(error).toBeDefined();
      expect(error?.value).toBe("User not found.");
    });
  });
  // Other test suites...
});
