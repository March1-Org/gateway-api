import { dockerode } from "./utils/dockerode";

async function teardown() {
  const context = JSON.parse(
    await Bun.file("./test/context/context.json").text()
  );

  const container = dockerode.getContainer(context.containerId);

  await container.stop();
  await container.remove();
}

await teardown();
