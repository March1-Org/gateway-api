import { dockerode } from "./dockerode";

export async function launchMockCache() {
  const container = await dockerode.createContainer({
    Image: "redis:latest",
    Env: [
      `REDIS_PASSWORD=${process.env.REDIS_PASSWORD}`,
      `REDIS_DB=${process.env.REDIS_DB}`,
    ],
    ExposedPorts: { "6379/tcp": {} },
    HostConfig: {
      PortBindings: { "6379/tcp": [{ HostPort: "6379" }] },
    },
  });

  await container.start();
  return container;
}
