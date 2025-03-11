import { Client } from "pg";
import { dockerode } from "./dockerode";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

type Options = {
  containerId: string;
};

export async function getMockDb({ containerId }: Options) {
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
  await migrate(mockDb, { migrationsFolder: "./drizzle" });

  return mockDb;
}
