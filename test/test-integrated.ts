import { launchMockDb } from "./utils/launchMockDb";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { dockerode } from "./utils/dockerode";

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

async function setup() {
  const container = await launchMockDb();
  await Bun.write(
    "./test/context/context.json",
    JSON.stringify({
      containerId: container.id,
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

  const container = dockerode.getContainer(context.containerId);
  await client.end();
  await container.stop();
  await container.remove();
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
