import { createApp } from "createApp";
import { getDb } from "db";
import { getCache } from "db/cache";
import { schemaBodies, schema } from "db/schema";

const db = await getDb();
const cache = getCache();

const app = createApp({ db, schemaBodies, schema, cache }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
type App = typeof app;

export { app };
export type { App };
