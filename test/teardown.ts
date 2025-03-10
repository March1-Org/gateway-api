import { teardownTestContext } from "./utils/testContext";

export default async function globalTeardown() {
  await teardownTestContext();
}
