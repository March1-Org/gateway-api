import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function getTestDb() {
  const container = await new PostgreSqlContainer("postgres:latest")
    .withStartupTimeout(30 * 1000)
    .start();

  const client = new Client({
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
  });
  await client.connect();

  const mockDb = drizzle(client);
  await migrate(mockDb, { migrationsFolder: "./drizzle" });

  return { mockDb, container };
}
