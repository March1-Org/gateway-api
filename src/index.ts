import { schema, schemaBodies } from '@march1-org/db-template';
import { createApp } from 'createApp';
import { getCache } from 'lib/cache';
import { getDb } from 'lib/db';

const db = await getDb();
const cache = getCache();

const app = createApp({ cache, db, schema, schemaBodies }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
type App = typeof app;

export { app };
export type { App };
