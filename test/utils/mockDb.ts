import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import Dockerode, { Container } from "dockerode";

const dockerode = new Dockerode({ host: "127.0.0.1", port: 2375 });

export async function getMockDb() {
  let container: Container | undefined = undefined;
  try {
    container = await startDb();

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

    return { mockDb, container };
  } catch (e) {
    console.log(e);
  }
  if (container) await stopDb(container);
}

export async function startDb() {
  const container = await dockerode.createContainer({
    Image: "postgres:latest",
    Env: [
      `POSTGRES_USER=${process.env.POSTGRES_USER}`,
      `POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD}`,
      `POSTGRES_DB=${process.env.POSTGRES_DB}`,
    ],
    ExposedPorts: { "5432/tcp": {} },
    HostConfig: {
      PortBindings: { "5432/tcp": [{ HostPort: "5432" }] },
    },
  });

  await container.start();
  return container;
}

export async function stopDb(container: Container) {
  await container.stop();
  await container.remove();
}
