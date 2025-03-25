import { createApp } from "createApp";
import { getDb } from "db";
import { getCache } from "db/cache";
import { schemaBodies, schema } from "db/schema";

const db = await getDb();
const cache = getCache();

const gatewayApp = createApp({ db, schemaBodies, schema, cache }).listen(3000);

console.log(
  `🦊 Elysia is running at ${gatewayApp.server?.hostname}:${gatewayApp.server?.port}`
);
type GatewayApp = typeof gatewayApp;

export { gatewayApp };
export type { GatewayApp };
