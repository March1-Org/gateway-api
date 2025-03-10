// testContext.ts
import { createApp } from "@/createApp";
import { treaty } from "@elysiajs/eden";
import { getMockDb, stopDb } from "./mockDb";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import jwt from "@elysiajs/jwt";
import type { app } from "@/index";

// Define the test context
interface TestContext {
  db: Awaited<ReturnType<typeof getMockDb>>;
  api: ReturnType<typeof treaty<typeof app>>;
  authorization: string;
}

export let testContext: TestContext | undefined;

// Global setup function
export async function setupTestContext(): Promise<TestContext> {
  if (testContext) return testContext; // Return existing context if already initialized

  // Start the database
  const db = await getMockDb();
  if (!db) throw new Error("Failed to start the database");

  // Initialize the app and API
  const app = createApp({
    db: db.mockDb,
    dbBodies,
    schema,
  });
  const api = treaty(app);

  // Generate JWT token
  const authorization = await jwt({
    secret: process.env.TEMPLATE_JWT_SECRET!,
  }).decorator.jwt.sign({});

  // Seed the database with test data (if needed)
  await api.users.post(
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

  // Store the context
  testContext = { db, api, authorization };
  return testContext;
}

// Global teardown function
export async function teardownTestContext(): Promise<void> {
  if (testContext && testContext.db && testContext.db.container) {
    await stopDb(testContext.db.container);
  }
}
