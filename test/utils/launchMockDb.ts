import { dockerode } from "./dockerode";

export async function launchMockDb() {
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
