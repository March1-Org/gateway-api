import { drizzle } from "drizzle-orm/node-postgres";
import { startDb, stopDb } from "./test/utils/mockDb";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import Dockerode from "dockerode";
import { dbBodies } from "@/db";
import { schema } from "@/db/schema";
import { createApp } from "@/createApp";
import { treaty } from "@elysiajs/eden";
import jwt from "@elysiajs/jwt";

const dockerode = new Dockerode({ host: "127.0.0.1", port: 2375 });

const container = await startDb();

await new Promise((resolve) => setTimeout(resolve, 5000));

// Get the container's IP address and mapped port
const containerInfo = await dockerode.getContainer(container.id).inspect();
const host = "127.0.0.1"; // Use localhost since the container is bound to the host
const port = containerInfo.NetworkSettings.Ports["5432/tcp"][0].HostPort; // Get the mapped port

const client = new Client({
  host,
  port: parseInt(port, 10), // Ensure the port is a number
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

const authorization = await jwt({
  secret: process.env.TEMPLATE_JWT_SECRET!,
}).decorator.jwt.sign({});

const api = treaty(app, {
  headers: {
    authorization,
  },
});

await api.users.post({
  age: 24,
  email: "test.email@.com",
  name: "Alonzo",
});

console.log((await api.users({ id: 1 }).get()).data);

process.exit(0);
