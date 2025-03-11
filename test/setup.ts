import { launchMockDb } from "./utils/launchMockDb";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createApp } from "@/createApp";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import { treaty } from "@elysiajs/eden";
import jwt from "@elysiajs/jwt";

const container = await launchMockDb();
await Bun.write(
  "./test/context/context.json",
  JSON.stringify({
    containerId: container.id,
  })
);

await new Promise((resolve) => setTimeout(resolve, 5000));

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
await client.connect();

const mockDb = drizzle(client);
await migrate(mockDb, { migrationsFolder: "./drizzle" });

const app = createApp({
  db: mockDb,
  dbBodies,
  schema,
});

const api = treaty(app);

const authorization = await jwt({
  secret: process.env.TEMPLATE_JWT_SECRET!,
}).decorator.jwt.sign({});

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

process.exit(0);
