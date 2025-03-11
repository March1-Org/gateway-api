import { afterAll, beforeAll } from "bun:test";
import { launchMockDb } from "./utils/launchMockDb";
import { dockerode } from "./utils/dockerode";

// beforeAll(async () => {
//   const container = await launchMockDb();
//   await Bun.write(
//     "./test/context/context.json",
//     JSON.stringify({
//       containerId: container.id,
//     })
//   );

//   await new Promise((resolve) => setTimeout(resolve, 5000));
//   process.exit(0);
// });

// afterAll(async () => {
//   const context = JSON.parse(
//     await Bun.file("./test/context/context.json").text()
//   );
//   const container = dockerode.getContainer(context.containerId);
//   await container.stop();
//   await container.remove();
// });

const container = await launchMockDb();
await Bun.write(
  "./test/context/context.json",
  JSON.stringify({
    containerId: container.id,
  })
);

await new Promise((resolve) => setTimeout(resolve, 5000));
process.exit(0);
