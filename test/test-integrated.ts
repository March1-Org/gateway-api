import { launchMockDb } from "./utils/launchMockDb";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { dockerode } from "./utils/dockerode";
import { launchMockCache } from "./utils/launchMockCache";

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

async function setup() {
  const dbContainer = await launchMockDb();
  const cacheContainer = await launchMockCache();
  await Bun.write(
    "./test/context/context.json",
    JSON.stringify({
      dbContainerId: dbContainer.id,
      cacheContainerId: cacheContainer.id,
    })
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await client.connect();

  const mockDb = drizzle(client);
  await migrate(mockDb, { migrationsFolder: "./drizzle" });
}

async function teardown() {
  const context = JSON.parse(
    await Bun.file("./test/context/context.json").text()
  );

  const dbContainer = dockerode.getContainer(context.dbContainerId);
  const cacheContainer = dockerode.getContainer(context.cacheContainerId);
  await client.end();
  await dbContainer.stop();
  await dbContainer.remove();
  await cacheContainer.stop();
  await cacheContainer.remove();
}

async function runTests() {
  try {
    await setup();
    await Bun.spawn(["bun", "test"]).exited;
  } finally {
    await teardown();
  }
}

await runTests();
