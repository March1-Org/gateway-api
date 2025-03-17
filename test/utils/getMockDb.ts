import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export async function getMockDb() {
  const client = new Client({
    host: "127.0.0.1",
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();

  const mockDb = drizzle(client);

  return mockDb;
}
