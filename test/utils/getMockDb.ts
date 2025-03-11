import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export async function getMockDb() {
  //   const containerInfo = await dockerode.getContainer(containerId).inspect();
  //   const host = "127.0.0.1";

  const client = new Client({
    host: "127.0.0.1",
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();

  const mockDb = drizzle(client);

  return mockDb;
}
